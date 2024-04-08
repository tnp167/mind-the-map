import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import markerA from "../../assets/icons/marker-a.png";
import markerB from "../../assets/icons/marker-b.png";
import "./RoutePlanner.scss";
function RoutePlanner() {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOXGL_ACCESS_TOKEN;

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
    });

    map.loadImage(markerA, (error, image) => {
      if (error) throw error;
      if (!map.hasImage("markerA")) map.addImage("markerA", image);
    });

    map.loadImage(markerB, (error, image) => {
      if (error) throw error;
      if (!map.hasImage("markerB")) map.addImage("markerB", image);
    });

    map.on("load", () => {
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
        console.log(event.result.geometry);
        setStartPoint(event.result.geometry.coordinates);
      });

      endGeocoder.on("result", (event) => {
        map.getSource("end-point").setData(event.result.geometry);
        console.log(event.result.geometry.coordinates);
        setEndPoint(event.result.geometry.coordinates);
      });
    });

    map.addControl(startGeocoder);
    map.addControl(endGeocoder);

    return () => map.remove();
  }, []);

  console.log(startPoint);
  console.log(endPoint);
  return (
    <>
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
      {startPoint && endPoint && <h3>Hello</h3>}
    </>
  );
}

export default RoutePlanner;
