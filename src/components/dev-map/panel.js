import "./stylesheets/panel.css";
import { union } from "@turf/turf";
import { useMemo } from "react";

export default function Panel({
  onSubmit,
  setUpload,
  setPopupVisible: setAboutVisible,
  selection,
}) {
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
            alert(
              "Failed to read FeatureCollection. Please try uploading a Polygon or MultiPolygon Feature instead."
            );
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
        alert(
          "GeoJSON must be a Feature or FeatureCollection of Polygons or MultiPolygons."
        );
        return;
      }

      // MultiPolygon features are already handled

      setUpload(geojson);
    } catch (err) {
      console.error(err);
      alert("Failed to read GeoJSON file.");
    }
  };

  const submitButtonContent = useMemo(() => {
    // console.log("Panel selection state:", selection);
    if (!selection) return null;

    return (
      <div>
        <input
          onClick={onSubmit}
          type="submit"
          id="fileSubmit"
          className="hidden-file-input"
        ></input>
        <div className="file-input" id="submit-button">
          <label htmlFor="fileSubmit">Submit</label>
        </div>
        {/* <div id="intersection-status">
          <p>
            Press <strong>SUBMIT</strong> to test your site area.
          </p>
        </div> */}
      </div>
    );
  }, [selection, onSubmit]);

  return (
    <div className="left-panel-holder">
      <div className="left-panel">
        <div className="panel-contents">
          <div>
            <br />
            <img
              src="/TLaWC-Web-Logo-500px-205px-1.png"
              alt="Taungurung Land and Water Council Logo"
            ></img>
            <h3>Site CHMP Trigger Map</h3>
            <div className="horizontal-line"></div>
            <p>
              <strong>Draw a polygon using the draw tools on the right</strong>
            </p>
            <p className="br-or">or</p>
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="area-input"
                className="hidden-file-input"
                onChange={onInput}
              ></input>
              <div className="file-input">
                <label htmlFor="area-input">Upload Site GeoJSON</label>
              </div>
              <br />
            </div>
            {submitButtonContent}
          </div>
          <button
            className="file-input"
            onClick={() => setAboutVisible(true)}
            id="about-button"
          >
            <strong>About</strong>
          </button>
        </div>
      </div>
    </div>
  );
}
