import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function MapScreen() {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" />
      <style>
        body { margin: 0; padding: 0; }
        #map { width: 100vw; height: 100vh; }
        #loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          z-index: 1000;
        }
        .cluster-icon {
          background-color: #0a7ea4;
          color: white;
          border-radius: 50%;
          font-weight: bold;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <div id="loading">Loading lanternfly data...</div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
      <script>
        // Initialize map
        const map = L.map('map').setView([40.7128, -74.0060], 8);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);
        
        // Create marker cluster group with optimized settings
        const markers = L.markerClusterGroup({
          maxClusterRadius: 60,
          chunkedLoading: true,
          chunkInterval: 200,
          chunkDelay: 50,
          iconCreateFunction: function(cluster) {
            const count = cluster.getChildCount();
            let size = 'small';
            let sizeClass = 40;
            
            if (count > 100) {
              size = 'large';
              sizeClass = 50;
            } else if (count > 50) {
              size = 'medium';
              sizeClass = 45;
            }
            
            return L.divIcon({
              html: '<div class="cluster-icon" style="width: ' + sizeClass + 'px; height: ' + sizeClass + 'px;">' + count + '</div>',
              className: 'cluster-' + size,
              iconSize: [sizeClass, sizeClass]
            });
          }
        });
        
        // Fetch GeoJSON data from GitHub
        fetch('https://raw.githubusercontent.com/zachcowell/lantern/main/assets/lanternfly-sightings.geojson')
          .then(response => response.json())
          .then(data => {
            console.log('Loaded ' + data.features.length + ' sightings');
            
            // Hide loading indicator
            document.getElementById('loading').style.display = 'none';
            
            // Add markers
            const markerList = [];
            data.features.forEach(feature => {
              const [lng, lat] = feature.geometry.coordinates;
              const marker = L.marker([lat, lng], {
                icon: L.divIcon({
                  html: '<div style="background-color: #ff4444; width: 8px; height: 8px; border-radius: 50%; border: 1px solid white;"></div>',
                  className: 'custom-marker',
                  iconSize: [8, 8]
                })
              });
              
              // Add popup with info
              const date = new Date(feature.properties.date).toLocaleDateString();
              marker.bindPopup(
                '<strong>Sighting #' + feature.properties.id + '</strong><br>' +
                'Date: ' + date
              );
              
              markerList.push(marker);
            });
            
            // Add all markers to cluster group
            markers.addLayers(markerList);
            map.addLayer(markers);
            
            // Try to get user location
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                position => {
                  map.setView([position.coords.latitude, position.coords.longitude], 10);
                  
                  // Add user location marker
                  L.marker([position.coords.latitude, position.coords.longitude], {
                    icon: L.divIcon({
                      html: '<div style="background-color: #007AFF; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                      className: 'user-location',
                      iconSize: [16, 16]
                    })
                  }).addTo(map).bindPopup('Your location');
                },
                error => {
                  console.log('Location error:', error);
                }
              );
            }
          })
          .catch(error => {
            console.error('Error loading data:', error);
            document.getElementById('loading').innerHTML = 'Error loading data: ' + error.message;
          });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        style={styles.webview}
        source={{ html: htmlContent }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});