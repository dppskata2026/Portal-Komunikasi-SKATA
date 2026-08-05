import React from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export default function MapChart() {
  return (
    <ComposableMap projection="geoMercator" projectionConfig={{ center: [118, -2], scale: 800 }}>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} fill="#EAEAEC" stroke="#D6D6DA" />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
}
