import React, { useRef, useEffect, useState } from "react";

import Panel from "./panel";
import compare from "./comparer";
import { setBuffer } from "./comparer";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./stylesheets/map.css";
import { AddDrawMapbox } from "./mapControls";
import { centroid } from "@turf/turf";
import Popup from "../popup";

function AboutMap() {
  return (
    <p>
      This map mimics the ACHRIS public map accessible at{" "}
      <a
        href="https://achris.vic.gov.au/#/onlinemap"
        target="_blank"
        rel="noreferrer"
      >
        https://achris.vic.gov.au/#/onlinemap
      </a>
      .
      <br />
      <h4>How to use</h4>
      Use the polygon tool at the top-left to draw a site boundary on the map.
      Alternatively, you can upload a GeoJSON Polygon Feature to upload it onto
      the map.
      <br />
      Then, press <strong>SUBMIT</strong> to compare the site area to check
      Cultural Heritage Management Plan trigger boundaries.
      <h4>Rationale</h4>
      The rationale for this component is to separate the proposed TLaWC
      Cultural Heritage Digital Infrastructure from the functionalities provided
      by ACHRIS to further TLaWC's self responsibility and control over their
      own data.
    </p>
  );
}

async function loadGeoJSON(filePath) {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

let mapRef = null;
let draw = null;

export default function Map() {
  const [popupVisible, setPopupVisible] = useState(false);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const lng = 145.30695475536;
  const lat = -37.02114423207626;
  const zoom = 8;
  const API_KEY = "syqHzD2CoOfLLm8sgqWe";

  useEffect(() => {
    if (map.current) {
      console.log("Map already loaded.");
      return;
    }

    const bounds = [
      [143.18052716189982, -37.809150075981044],
      [147.2390058715678, -36.2606270578016],
    ];

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
      center: [lng, lat],
      zoom: zoom,
      maxBounds: bounds,
    });

    mapRef = map.current;

    map.current.addControl(new maplibregl.NavigationControl(), "bottom-right");

    draw = AddDrawMapbox(map.current);

    AddCHMPBuffer(map.current);
    AddTLaWCBoundary(map.current);
  }, [API_KEY, lng, lat, zoom]);

  return (
    <div className="page-container">
      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
      </div>
      <Panel
        onSubmit={() => compare(draw)}
        setUpload={SetUploaded}
        setPopupVisible={setPopupVisible}
      />
      {popupVisible && (
        <Popup About={AboutMap} setPopupVisible={setPopupVisible} />
      )}
    </div>
  );
}

function AddTLaWCBoundary(map) {
  map.on("load", async () => {
    try {
      const geojsonData = await loadGeoJSON("./dev-map/tlawc_single.geojson");

      map.addSource("tlawc_single", {
        type: "geojson",
        data: geojsonData,
      });

      map.addLayer({
        id: "tlawc",
        type: "line",
        source: "tlawc_single",
        layout: {},
        paint: {
          "line-color": getComputedStyle(
            document.documentElement
          ).getPropertyValue("--primary-color"),
          "line-width": 10,
        },
      });
    } catch (error) {
      console.error("Error loading or adding GeoJSON source:", error);
    }
  });
}

function AddCHMPBuffer(map) {
  map.on("load", async () => {
    try {
      const geojsonData = await loadGeoJSON("./dev-map/sample_buffer.geojson");

      map.addSource("chmp_buffer", {
        type: "geojson",
        data: geojsonData,
      });

      map.addLayer({
        id: "chmp_buffer",
        type: "fill",
        source: "chmp_buffer",
        layout: {},
        paint: {
          "fill-color": "#ffb300ff",
          "fill-opacity": 0.4,
        },
      });

      setBuffer(geojsonData);
    } catch (error) {
      console.error("Error loading or adding GeoJSON source:", error);
    }
  });
}

function SetUploaded(feature) {
  draw.deleteAll();
  draw.add(feature);
  document.getElementById("file-upload-status").innerHTML = `Feature uploaded.`;
  const featureCentre = centroid(feature);
  mapRef.flyTo({
    center: featureCentre.geometry.coordinates,
    zoom: 15,
    essential: true, // this animation is considered essential with respect to prefers-reduced-motion
  });
}
