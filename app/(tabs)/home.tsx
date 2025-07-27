import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const userLat = location?.coords.latitude || 40.7128;
  const userLng = location?.coords.longitude || -74.0060;
  const hasLocation = !!location;

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
        .user-location-container {
          position: relative;
        }
        .pulsing-dot {
          width: 12px;
          height: 12px;
          background-color: #007AFF;
          border-radius: 50%;
          position: absolute;
          top: 4px;
          left: 4px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .pulsing-dot::before {
          content: '';
          position: absolute;
          top: -8px;
          left: -8px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: rgba(0, 122, 255, 0.3);
          animation: pulse 2s ease-out infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <div id="loading">Loading lanternfly data...</div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
      <script>
        // Initialize map with user location from React Native
        let map;
        const userLat = ${userLat};
        const userLng = ${userLng};
        const hasUserLocation = ${hasLocation};
        
        // Initialize map centered on user location with closer zoom
        map = L.map('map').setView([userLat, userLng], hasUserLocation ? 13 : 10);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);
        
        // Add user location marker if we have it
        if (hasUserLocation) {
          // Add blue pulsing dot for user location
          const pulsingIcon = L.divIcon({
            html: '<div class="pulsing-dot"></div>',
            className: 'user-location-container',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
          
          L.marker([userLat, userLng], {
            icon: pulsingIcon,
            zIndexOffset: 1000
          }).addTo(map).bindPopup('Your location');
        }
        
        loadData();
        
        function loadData() {
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
            })
            .catch(error => {
              console.error('Error loading data:', error);
              document.getElementById('loading').innerHTML = 'Error loading data: ' + error.message;
            });
        }
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