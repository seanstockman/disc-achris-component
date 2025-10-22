import Map from "../components/dev-map/map";
import { useEffect } from "react";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const pageTitle = "TLaWC Developer Map";

export default function MapPage() {
  useEffect(() => {
    document.title = pageTitle;
  });

  return (
    <Map />
  );
}
