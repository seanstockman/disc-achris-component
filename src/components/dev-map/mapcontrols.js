import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { drawstyles as styles } from "./stylesheets/mapboxdrawstyles";
import addGeocoder from "./geocoder";

MapboxDraw.constants.classes.CANVAS = "maplibregl-canvas";
MapboxDraw.constants.classes.CONTROL_BASE = "maplibregl-ctrl";
MapboxDraw.constants.classes.CONTROL_PREFIX = "maplibregl-ctrl-";
MapboxDraw.constants.classes.CONTROL_GROUP = "maplibregl-ctrl-group";
MapboxDraw.constants.classes.ATTRIBUTION = "maplibregl-ctrl-attrib";

export function AddDrawMapbox(map, setSelection) {
  // MapboxDraw requires the canvas's class order to have the class
  // "mapboxgl-canvas" first in the list for the key bindings to work
  map.getCanvas().className = "mapboxgl-canvas maplibregl-canvas";
  map.getContainer().classList.add("mapboxgl-map");
  const canvasContainer = map.getCanvasContainer();
  canvasContainer.classList.add("mapboxgl-canvas-container");
  if (canvasContainer.classList.contains("maplibregl-interactive")) {
    canvasContainer.classList.add("mapboxgl-interactive");
  }

  const draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
      polygon: true,
      trash: true,
    },
    styles,
  });

  const originalOnAdd = draw.onAdd.bind(draw);
  draw.onAdd = (map) => {
    const controlContainer = originalOnAdd(map);
    controlContainer.classList.add("maplibregl-ctrl", "maplibregl-ctrl-group");
    return controlContainer;
  };

  addGeocoder(map, "top-right");

  map.addControl(draw, "top-left");

  map.on("draw.update", update);
  map.on("draw.create", update);
  map.on("draw.delete", drawDeleteCustom);
  map.on("draw.add", update);

  function drawDeleteCustom(e) {
    draw.deleteAll();
    setSelection(null);
  }

  function update(e) {
    const data = draw.getAll();
    if (data.features.length <= 0) {
      setSelection(null);
      return;
    }
    if (data.features.length > 1) {
      const newFeature = data.features[0];
      draw.deleteAll();
      draw.add(newFeature);
    }
    setSelection(draw.getAll().features[0]);
    // console.log("Setting selection to:", data.features[0]);
  }

  return draw;
}
