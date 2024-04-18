import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import markerA from "../../assets/icons/marker-a.png";
import markerB from "../../assets/icons/marker-b.png";
import Options from "../../components/Options/Options";
import Header from "../../components/Header/Header";
import "./RoutePlanner.scss";
import RouteDetails from "../../components/RouteDetails/RouteDetails";
import backChevron from "../../assets/icons/chevron-back.png";
import "../../styles/partials/_variables.scss";
import { Chip, Switch, Grid } from "@mui/material";
import List from "../../components/List/List";
import london from "../../assets/images/london.png";
import Rating from "@mui/material/Rating";
import ReactDOMServer from "react-dom/server";
import Bike from "../../components/Bike/Bike";
import Weather from "../../components/Weather/Weather";

function RoutePlanner() {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const startGeo = useRef(null);
  const endGeo = useRef(null);
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOXGL_ACCESS_TOKEN;

  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [places, setPlaces] = useState("");
  const [toilets, setToilets] = useState("");
  const [markers, setMarkers] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [filteredToilets, setFilteredToilets] = useState([]);
  const [type, setType] = useState("Restaurants");
  const handleChange = () => {
    setType((prevType) =>
      prevType === "Restaurants" ? "Toilets" : "Restaurants"
    );
  };
  const handlePlaceClick = (id) => {
    markers.forEach((marker) => {
      marker.getPopup().remove();
    });
    const marker = markers.find(
      (marker) => marker.getElement().id === `marker-${id}`
    );
    if (marker) {
      const mapContainer = document.getElementById("map");
      mapContainer.scrollIntoView({ behavior: "smooth" });

      marker.togglePopup();
    }
  };

  const scrollToItem = (index) => {
    const restaurantElement = document.getElementById(`item-${index}`);
    if (restaurantElement) {
      restaurantElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (mapRef.current) return;
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-0.1276, 51.5074],
      zoom: 12,
      attributionControl: false,
      maxBounds: [
        [-0.5104, 51.2868],
        [0.334, 51.6919],
      ],
    });

    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserLocation: true,
      position: "bottom-left",
    });
    map.addControl(geolocateControl);

    const startGeocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      bbox: [-0.5104, 51.2868, 0.334, 51.6919],
      proximity: {
        longitude: -0.1276,
        latitude: 51.5074,
      },
      placeholder: "Start",
      position: "top-left",
    });

    startGeo.current = startGeocoder;

    geolocateControl.on("geolocate", async function (e) {
      let userLocation = e.coords;
      if (userLocation) {
        const lngLat = [userLocation.longitude, userLocation.latitude];

        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat[0]},${lngLat[1]}.json?access_token=${mapboxgl.accessToken}`
          );
          const data = await response.json();

          const locationName = data.features[0].place_name;
          console.log("Location Name:", locationName);
          startGeocoder.query(locationName);
        } catch (error) {
          console.error("Error retrieving location name:", error);
        }
      }
    });

    const endGeocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      bbox: [-0.5104, 51.2868, 0.334, 51.6919],
      proximity: {
        longitude: -0.1276,
        latitude: 51.5074,
      },
      placeholder: "End",
      position: "top-left",
    });

    endGeo.current = endGeocoder;

    map.on("load", () => {
      map.loadImage(markerA, (error, image) => {
        if (error) throw error;
        if (!map.hasImage("markerA")) map.addImage("markerA", image);
      });

      map.loadImage(markerB, (error, image) => {
        if (error) throw error;
        if (!map.hasImage("markerB")) map.addImage("markerB", image);
      });

      map.addSource("start-point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.addSource("end-point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.addLayer({
        id: "start-point",
        source: "start-point",
        type: "symbol",
        layout: {
          "icon-image": "markerA",
          "icon-size": 1,
          "icon-allow-overlap": true,
        },
      });

      map.addLayer({
        id: "end-point",
        source: "end-point",
        type: "symbol",
        layout: {
          "icon-image": "markerB",
          "icon-size": 1,
          "icon-allow-overlap": true,
        },
      });

      startGeocoder.on("result", (event) => {
        map.getSource("start-point").setData(event.result.geometry);
        setStartPoint(event.result.geometry.coordinates);
      });

      endGeocoder.on("result", (event) => {
        map.getSource("end-point").setData(event.result.geometry);
        setEndPoint(event.result.geometry.coordinates);
      });
    });

    map.addControl(startGeocoder, "top-left");
    map.addControl(endGeocoder, "top-left");
    map.addControl(new mapboxgl.NavigationControl());

    mapRef.current = map;

    // return () => map.remove();
  }, [startPoint, endPoint]);

  useEffect(() => {
    const map = mapRef.current;
    if (map && startPoint && endPoint) {
      const bounds = new mapboxgl.LngLatBounds()
        .extend(startPoint)
        .extend(endPoint);
      map.fitBounds(bounds, { padding: 50 });
    }
  }, [startPoint, endPoint]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    // map.on("load", () => {
    if (selectedRoute) {
      for (let i = 0; i < selectedRoute.legs.length; i++) {
        const legId = `route-line-${i}`;
        map.getSource(legId) && map.removeSource(legId);
        map.getLayer(legId) && map.removeLayer(legId);
      }

      const style = map.getStyle();
      if (style) {
        for (const layer of style.layers) {
          if (layer.id.startsWith("route-line-")) {
            map.removeLayer(layer.id);
          }
        }

        const sourceIds = Object.keys(style.sources);
        for (const sourceId of sourceIds) {
          if (sourceId.startsWith("route-line-")) {
            map.removeSource(sourceId);
          }
        }
      }

      if (startGeo) {
        map.removeControl(startGeo.current);
      }
      if (endGeo) {
        map.removeControl(endGeo.current);
      }

      for (let i = 0; i < selectedRoute.legs.length; i++) {
        const leg = selectedRoute.legs[i];
        const lineString = JSON.parse(leg.path.lineString).map(
          (coordinates) => [coordinates[1], coordinates[0]]
        );

        const lineColor = window
          .getComputedStyle(document.documentElement)
          .getPropertyValue(
            `--${
              leg.mode.id === "tube"
                ? leg.routeOptions[0].name.toLowerCase().replace(/[\s&]/g, "-")
                : leg.mode.id.toLowerCase().replace(/[\s&]/g, "-")
            }`
          );

        console.log(leg.routeOptions[0].name);

        const lineStringFeature = {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: lineString,
          },
        };

        const legId = `route-line-${i}`;
        map.addSource(legId, {
          type: "geojson",
          data: lineStringFeature,
        });

        map.addLayer({
          id: legId,
          type: "line",
          source: legId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": lineColor,
            "line-width": 5,
          },
        });
      }
    }
    // });
    return () => {};
  }, [selectedRoute]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markers.forEach((marker) => marker.remove());

    setMarkers([]);

    let filteredPlaces;
    if (type === "Restaurants") {
      filteredPlaces = places?.data?.filter(
        (place) => Number(place.rating) > ratingFilter
      );
    } else if (type === "Toilets") {
      if (isChecked) {
        filteredPlaces = toilets?.data?.filter(
          (place) => place.accessible === true && place.distance < 1
        );
      } else {
        filteredPlaces = toilets?.data?.filter((place) => place.distance < 1);
      }
    }

    if (filteredPlaces) {
      filteredPlaces?.forEach((place, index) => {
        const latitude = parseFloat(place.latitude);
        const longitude = parseFloat(place.longitude);

        if (!isNaN(latitude) && !isNaN(longitude) && place.name) {
          const markerElement = document.createElement("div");
          markerElement.className =
            type === "Restaurants" ? "restaurants-marker" : "toilets-marker";
          markerElement.id = `marker-${
            place.location_id ? place.location_id : place.id
          }`;

          const popupContent = ReactDOMServer.renderToString(
            <div>
              <img
                src={`${place.photo ? place.photo.images.small.url : london}`}
                className="image"
              />
              <p>{place.name}</p>
              {place.rating && (
                <Rating value={Number(place.rating)} precision={0.5} readOnly />
              )}
              {place.accessible !== undefined && (
                <Chip
                  size="small"
                  label={place.accessible ? "✓ accessible" : "✕ accessible"}
                  className="place__chip"
                />
              )}
            </div>
          );
          const marker = new mapboxgl.Marker(markerElement)
            .setLngLat([place.longitude, place.latitude])
            .setPopup(
              new mapboxgl.Popup({ closeButton: false }).setHTML(popupContent)
            )
            .addTo(map);

          marker.getPopup().on("open", () => {
            const locationId = place.location_id ? place.location_id : place.id;
            marker
              .getPopup()
              .getElement()
              .addEventListener("click", () => {
                scrollToItem(locationId);
              });
          });

          setMarkers((prevMarkers) => [...prevMarkers, marker]);
        }
      });
    }
  }, [places, ratingFilter, toilets, isChecked, type]);

  const handleRouteBack = () => {
    setSelectedRoute(null);
    const map = mapRef.current;

    for (let i = 0; i < selectedRoute.legs.length; i++) {
      const legId = `route-line-${i}`;
      map.getSource(legId) && map.removeSource(legId);
      map.getLayer(legId) && map.removeLayer(legId);
    }

    markers.forEach((marker) => marker.remove());

    setMarkers([]);
    setType("Restaurants");
    setPlaces("");
    setToilets("");

    map.addControl(startGeo.current, "top-left");
    map.addControl(endGeo.current, "top-left");
  };

  return (
    <>
      <Header headerColor={"base"} station={"Mind the Map"} />
      {selectedRoute && (
        <>
          <div className="back">
            <div className="back-container" onClick={handleRouteBack}>
              <img src={backChevron} alt="" className="back__icon" />
              <p className="back__text">Way out</p>
            </div>
          </div>
          <div className="block">
            <RouteDetails route={selectedRoute} className="route" id="route" />
            <Weather
              startPoint={startPoint}
              endPoint={endPoint}
              className="weather"
            />
          </div>
          {/* <Grid
            container
            spacing={3}
            style={{ width: "100%" }}
            className="grid"
          >
            <Grid item xs={12} md={4}>
              <Bike route={selectedRoute} />
            </Grid>
          </Grid> */}
        </>
      )}
      <div className="map__container">
        <div id="map" ref={mapContainerRef} className="map" />
        {startPoint && endPoint && !selectedRoute && (
          <Options
            startPoint={startPoint}
            endPoint={endPoint}
            setSelectedRoute={setSelectedRoute}
          />
        )}
        {selectedRoute && (
          <div className="switch__grid">
            <div className="switch__outer">
              <div className="switch__container">
                <h3>Restaurants</h3>
                <div class="toggle-cont">
                  <input
                    class="toggle-input"
                    id="toggle"
                    name="toggle"
                    type="checkbox"
                    onChange={handleChange}
                  />
                  <label class="toggle-label" for="toggle">
                    <div class="cont-label-play">
                      <span class="label-play"></span>
                    </div>
                  </label>
                </div>
                <h3>Toilets</h3>
              </div>
            </div>
            <Grid
              container
              spacing={3}
              style={{ width: "100%" }}
              className="grid"
            >
              <Grid item xs={12} md={4}>
                <List
                  startPoint={startPoint}
                  setPlaces={setPlaces}
                  places={places}
                  setToilets={setToilets}
                  toilets={toilets}
                  isChecked={isChecked}
                  setIsChecked={setIsChecked}
                  setRatingFilter={setRatingFilter}
                  ratingFilter={ratingFilter}
                  setFilteredToilets={setFilteredToilets}
                  filteredToilets={filteredToilets}
                  selectedRoute={selectedRoute}
                  handlePlaceClick={handlePlaceClick}
                  type={type}
                />
              </Grid>
            </Grid>
          </div>
        )}
      </div>
    </>
  );
}

export default RoutePlanner;
