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
import { v4 as uuidv4 } from "uuid";

function RoutePlanner() {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const startGeo = useRef(null);
  const endGeo = useRef(null);
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOXGL_ACCESS_TOKEN;

  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

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
  }, []);

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
      // for (let i = 0; i < selectedRoute.legs.length; i++) {
      //   const legId = `route-line-${i}`;
      //   map.getSource(legId) && map.removeSource(legId);
      //   map.getLayer(legId) && map.removeLayer(legId);
      // }

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

      map.removeControl(startGeo.current);
      map.removeControl(endGeo.current);

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

  const handleRouteBack = () => {
    setSelectedRoute(null);
    const map = mapRef.current;

    for (let i = 0; i < selectedRoute.legs.length; i++) {
      const legId = `route-line-${i}`;
      map.getSource(legId) && map.removeSource(legId);
      map.getLayer(legId) && map.removeLayer(legId);
    }
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
          <RouteDetails route={selectedRoute} />
        </>
      )}
      <div
        id="map"
        ref={mapContainerRef}
        style={{ width: "100%", height: "400px" }}
        className="map"
      />
      {startPoint && endPoint && !selectedRoute && (
        <Options
          startPoint={startPoint}
          endPoint={endPoint}
          setSelectedRoute={setSelectedRoute}
        />
      )}
    </>
  );
}

export default RoutePlanner;
