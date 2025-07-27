const fs = require('fs');
const path = require('path');

// Read the original JSON file
const inputPath = path.join(__dirname, '../assets/edd-maps-spotted-lanternfly.json');
const outputPath = path.join(__dirname, '../assets/lanternfly-sightings.geojson');

try {
  // Read and parse the input data
  const rawData = fs.readFileSync(inputPath, 'utf8');
  const data = JSON.parse(rawData);

  // Convert to GeoJSON format
  const geojson = {
    type: 'FeatureCollection',
    features: data.data.map(sighting => ({
      type: 'Feature',
      properties: {
        id: sighting.objectid,
        date: sighting.keys.observationdate,
        eradicationStatus: sighting.keys.eradicationstatusid,
        visitType: sighting.keys.visittype
      },
      geometry: {
        type: 'Point',
        coordinates: [sighting.longitude_decimal, sighting.latitude_decimal]
      }
    }))
  };

  // Write the GeoJSON file
  fs.writeFileSync(outputPath, JSON.stringify(geojson, null, 2));
  
  console.log(`✅ Successfully converted ${geojson.features.length} sightings to GeoJSON`);
  console.log(`📄 Output saved to: ${outputPath}`);
} catch (error) {
  console.error('❌ Error converting to TypeScript:', error);
  process.exit(1);
}