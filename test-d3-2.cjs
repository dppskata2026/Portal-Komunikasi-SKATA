const d3 = require('d3-geo');

const proj = d3.geoMercator()
  .center([118, -2])
  .scale(900)
  .translate([150, 75]);

console.log("Medan:", proj([98.6722, 3.5952]));
console.log("Jakarta:", proj([106.8275, -6.1751]));
console.log("Surabaya:", proj([112.7521, -7.2504]));
console.log("Makassar:", proj([119.4327, -5.1477]));
console.log("Papua (approx):", proj([140, -4]));
