import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export default function IndonesiaMap() {
  const markers = [
    { name: "DPW 1 (Medan)", coordinates: [98.6722, 3.5952] },
    { name: "DPW 2 (Jakarta)", coordinates: [106.8275, -6.1751] },
    { name: "DPW 3 (Surabaya)", coordinates: [112.7521, -7.2504] },
    { name: "DPW 4 (Balikpapan)", coordinates: [116.8252, -1.2692] },
    { name: "DPW 5 (Makassar)", coordinates: [119.4327, -5.1477] }
  ];

  return (
    <ComposableMap 
      projection="geoMercator" 
      projectionConfig={{
        center: [118, -2],
        scale: 800
      }}
      width={400}
      height={200}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies
            .filter(geo => geo.properties.name === "Indonesia" || geo.properties.name === "Malaysia")
            .map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#4a4a4f"
                stroke="#2a2a2e"
                strokeWidth={0.5}
              />
            ))
        }
      </Geographies>
      {markers.map(({ name, coordinates }) => (
        <Marker key={name} coordinates={coordinates as [number, number]}>
          <circle r={3} fill="#ff1d27" stroke="#fff" strokeWidth={1} />
        </Marker>
      ))}
    </ComposableMap>
  );
}
