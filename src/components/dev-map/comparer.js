import * as turf from "@turf/turf";
import { chmpRequired } from "./comparerResult";

let buffer = null;

export default function compare(draw) {
  if (draw.getAll().features.length > 0) {
    checkForBufferOverlap(draw.getAll().features[0]);
    return;
  }

	alert("Draw a polygon on the map or upload a GeoJSON file of the site to determine CHMP requirement.");
	return;
}

/**
 * Compares the map to the site
 * @param {*} map
 */
function checkForBufferOverlap(selection) {
  if (!validateGeometry(selection)) return console.error("No drawn polygon.");
  console.log(selection);
  const status = document.getElementById("intersection-status");

  try {
    const intersection = turf.intersect(
      turf.featureCollection([selection, buffer])
    );
    if (intersection) {
      console.log("Intersection found.");
      // status.innerHTML = `<p style="margin:0; padding:0;">Your site is near a culturally significant site listed by TLaWC. You require a <a target="_blank" href="https://www.firstpeoplesrelations.vic.gov.au/cultural-heritage-management-plans" style="margin:0; padding:0;">Cultural Heritage Management Plan</a>.</p>`;
      status.innerHTML = chmpRequired();

      return;
    }
  } catch (err) {
    console.error("Intersection failed:", err);
    return;
  }

  console.log("No intersection found.");
  status.innerHTML = `<p>Your site is not near a culturally significant site listed by TLaWC.</p>`;
}

// export function compareToFile(map, siteDefinition) {
//   const buffer = map.buffer;
// }

function validateGeometry(feature) {
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
    merged = turf.union(merged, validBufferFeatures[i]);
    if (!merged) {
      console.error("Failed to union polygons:", i);
      return;
    }
  }

  if (!validateGeometry(merged)) console.error("Invalid merged geometry.");

  buffer = merged;
  console.log("Merged buffer:", buffer);
}
