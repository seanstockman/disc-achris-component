import { useRef, useEffect, useState } from "react";

import Panel from "./panel";
import compare from "./comparer";
import { setBuffer } from "./comparer";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./stylesheets/map.css";
import { AddDrawMapbox } from "./mapControls";
import Popup from "../popup";
import ComparerResult from "./comparerResult";

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
      Then, press <strong>Submit</strong> to compare the site area to check
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
  const [selection, setSelection] = useState(null);
  const [intersectionState, setIntersectionState] = useState("null");
  const [showAbout, setShowAbout] = useState(false);
  const [loading, setLoading] = useState(false);
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

    setLoading(true);

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

    draw = AddDrawMapbox(map.current, setSelection);

    AddCHMPBuffer(map.current, setLoading);
    AddTLaWCBoundary(map.current);
  }, [API_KEY, lng, lat, zoom]);

  const SetUpload = (feature) => {
    draw.deleteAll();
    draw.add(feature);
    setSelection(feature); // Directly set the selection

    // Calculate bounds for the uploaded feature
    const bounds = feature.geometry.coordinates[0].reduce((bounds, coord) => {
      return bounds.extend(coord);
    }, new maplibregl.LngLatBounds(feature.geometry.coordinates[0][0], feature.geometry.coordinates[0][0]));

    mapRef.fitBounds(bounds, {
      padding: 50,
      essential: true,
    });

    compare(feature, setIntersectionState, setLoading);
  };

  const Loading = () => {
    return <div id="loading">Loading, please wait...</div>;
  };

  return (
    <div className="page-container">
      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
      </div>
      <Panel
        onSubmit={() => compare(selection, setIntersectionState, setLoading)}
        setUpload={(feature) => {
          SetUpload(feature);
        }}
        setPopupVisible={setShowAbout}
        selection={selection}
      />
      {showAbout && <Popup About={AboutMap} setPopupVisible={setShowAbout} />}
      <ComparerResult
        intersectionState={intersectionState}
        setIntersectionState={setIntersectionState}
      />
      {/* <Loading/> */}
      {loading && <Loading/>}
    </div>
  );
}

function AddTLaWCBoundary(map) {
  map.on("load", async () => {
    try {
      const geojsonData = await loadGeoJSON(`${process.env.PUBLIC_URL}/dev-map/tlawc_boundary.geojson`);

      map.addSource("tlawc_boundary", {
        type: "geojson",
        data: geojsonData,
      });

      map.addLayer({
        id: "tlawc",
        type: "line",
        source: "tlawc_boundary",
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

function AddCHMPBuffer(map, setLoading) {
  map.on("load", async () => {
    try {
      const geojsonData = await loadGeoJSON(
        `${process.env.PUBLIC_URL}/dev-map/tlawc_trigger_buffer.geojson`
      );

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
    } finally {
      await new Promise(resolve => setTimeout(resolve, 1500)); // wait 0.5s
      setLoading(false);
    }
  });
}
