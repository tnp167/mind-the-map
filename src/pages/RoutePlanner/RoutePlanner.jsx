import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import markerA from "../../assets/icons/marker-a.png";
import markerB from "../../assets/icons/marker-b.png";
import Options from "../../components/Options/Options";
import Header from "../../components/Header/Header";
import "./RoutePlanner.scss";
function RoutePlanner() {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOXGL_ACCESS_TOKEN;

  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);

  useEffect(() => {
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

    mapRef.current = map;

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

    return () => map.remove();
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

  return (
    <>
      <Header headerColor={"base"} station={"Mind the Map"} />
      <div
        id="map"
        ref={mapContainerRef}
        style={{ width: "100%", height: "400px" }}
        className="map"
      />
      {startPoint && endPoint && (
        <Options startPoint={startPoint} endPoint={endPoint} />
      )}
    </>
  );
}

export default RoutePlanner;
