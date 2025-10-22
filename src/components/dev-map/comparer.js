import * as turf from "@turf/turf";

let buffer = null;

export default async function compare(selection, setIntersectionState, setLoading) {
  if (selection === null) {
    alert(
      "Draw a polygon on the map or upload a GeoJSON file of the site to determine CHMP requirement."
    );
    return;
  }

  await setLoading(true);
  await new Promise(resolve => setTimeout(resolve, 100)); // wait 0.5s
  checkForBufferOverlap(selection, setIntersectionState, setLoading);
}

/**
 * Compares the map to the site
 * @param {*} map
 */
function checkForBufferOverlap(selection, setIntersectionState, setLoading) {
  if (!validateGeometry(selection)) return console.error("No drawn polygon.");
  console.log("Submitted selection:", selection);

  try {
    const intersection = turf.intersect(
      turf.featureCollection([selection, buffer])
    );
    setLoading(false);
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
  buffer = inputBuffer;
}
