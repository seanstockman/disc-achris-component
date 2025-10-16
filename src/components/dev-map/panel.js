import "./stylesheets/panel.css";
import { union } from "@turf/turf";

export default function Panel({ onSubmit, setUpload }) {
  const onInput = async (e) => {
    const input = document.getElementById("area-input");
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".geojson")) {
      alert("Please enter a valid GeoJSON file.");
      input.value = "";
      return;
    }

    try {
      const text = await file.text();
      let geojson = JSON.parse(text);

      console.log("GeoJSON loaded:", geojson);
      
      if (geojson.type === "FeatureCollection") {
        let merged = geojson.features[0];

        for (let i = 1; i < geojson.features.length; i++) {
          merged = union(merged, geojson.features[i]);
          if (!merged) {
            console.error("Failed to union polygons:", i);
            alert("Failed to polygonise FeatureCollection. Please upload a Polygon or MultiPolygon Feature instead.");
            return;
          }
        }

        geojson = merged;
      } else if (geojson.type !== "Feature") {
        alert(
          "GeoJSON must be a Feature or FeatureCollection of Polygons or MultiPolygons."
        );
      }

      if (
        geojson.geometry.type !== "Polygon" &&
        geojson.geometry.type !== "MultiPolygon"
      ) {
        alert("GeoJSON must be a Feature or FeatureCollection of Polygons or MultiPolygons.");
        return;
      }

      if (geojson.geometry.type === "MultiPolygon") {
        geojson = geojson.features[0];
      }

      setUpload(geojson);
    } catch (err) {
      console.error(err);
      alert("Failed to read GeoJSON file.");
    }
  };

  return (
    <div className="left-panel-holder">
      <div className="left-panel">
        <div className="panel-contents">
          <img
            src="/tlawc-logo.jpg"
            alt="Taungurung Land and Water Council Logo"
          ></img>
          <h3>Developer CHMP Trigger Map</h3>
          <p>
            Draw a polygon using the draw tools on the right, or upload a
            shapefile of your site footprint.
          </p>
          <div className="file-upload-wrapper">
            <input
              type="file"
              id="area-input"
              className="hidden-file-input"
              onChange={onInput}
            ></input>
            <div className="file-input">
              <label for="area-input">CHOOSE GEOJSON FEATURE</label>
            </div>
            <br />
            <span id="file-upload-status" className="selected-file-name">
              No file chosen.
            </span>
          </div>
          <input
            onClick={onSubmit}
            type="submit"
            id="fileSubmit"
            className="hidden-file-input"
          ></input>
          <div className="file-input">
            <label for="fileSubmit">SUBMIT</label>
          </div>
          {/* <div id="selection-status">
            <p>No polygon created</p>
          </div> */}
          <div id="intersection-status">
            <p>
              Press <strong>SUBMIT</strong> to test your site area.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
