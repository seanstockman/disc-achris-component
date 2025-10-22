import * as turf from "@turf/turf";
import { chmpRequired } from "./comparerResult";

let buffer = null;

export default function compare(selection, setIntersectionState) {
  if (selection === null) {
    alert(
      "Draw a polygon on the map or upload a GeoJSON file of the site to determine CHMP requirement."
    );
    return;
  }

  checkForBufferOverlap(selection, setIntersectionState);
}

/**
 * Compares the map to the site
 * @param {*} map
 */
function checkForBufferOverlap(selection, setIntersectionState) {
  if (!validateGeometry(selection)) return console.error("No drawn polygon.");
  console.log("Submitted selection:", selection);
  const status = document.getElementById("intersection-status");
  // status.innerHTML = "<p><i>Loading...</i></p>";

  try {
    const intersection = turf.intersect(
      turf.featureCollection([selection, buffer])
    );
    if (intersection) {
      console.log("Intersection found.");
      setIntersectionState("yes");
    } else {
      setIntersectionState("no");
      console.log("No intersection found.");
    }
  } catch (err) {
    console.error("Intersection failed:", err);
    setIntersectionState("fail");
    return;
  }
}

// export function compareToFile(map, siteDefinition) {
//   const buffer = map.buffer;
// }

function validateGeometry(feature) {
  console.log(feature);
  if (!feature) return false;
  const geom = feature.geometry;
  if (!geom) return false;

  if (geom.type === "Polygon") {
    return Array.isArray(geom.coordinates) && geom.coordinates.length > 0;
  }

  if (geom.type === "MultiPolygon") {
    return (
      Array.isArray(geom.coordinates) &&
      geom.coordinates.length > 0 &&
      Array.isArray(geom.coordinates[0]) &&
      geom.coordinates[0].length > 0
    );
  }

  console.error("Unsupported geometry:", geom.type);
  return false;
}

export function setBuffer(inputBuffer) {
  const validBufferFeatures = inputBuffer.features.filter(validateGeometry);

  if (validBufferFeatures.length === 0) {
    return console.error("No valid polygons in buffer.");
  }

  // Start with the first polygon
  let merged = validBufferFeatures[0];

  for (let i = 1; i < validBufferFeatures.length; i++) {
    try {
      merged = turf.union(merged, validBufferFeatures[i]);
    } catch (error) {
      continue;
    }
  }

  if (!validateGeometry(merged)) console.error("Invalid merged geometry.");

  buffer = merged;
  console.log("Merged buffer:", buffer);
}
