import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import geojsonData from '@/assets/lanternfly-sightings.geojson';

export default function MapScreen() {
  const webViewRef = useRef<WebView>(null);

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
        
        // Create marker cluster group
        const markers = L.markerClusterGroup({
          maxClusterRadius: 60,
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
        
        // Function to load markers
        window.loadMarkers = function(data) {
          try {
            const geojsonData = JSON.parse(data);
            let count = 0;
            
            if (geojsonData && geojsonData.features) {
              geojsonData.features.forEach(feature => {
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
                
                markers.addLayer(marker);
                count++;
              });
            }
            
            map.addLayer(markers);
            console.log('Loaded ' + count + ' markers');
          } catch (error) {
            console.error('Error loading markers:', error);
          }
        };
        
        // Try to get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              map.setView([position.coords.latitude, position.coords.longitude], 10);
            },
            error => {
              console.log('Location error:', error);
            }
          );
        }
        
        // Signal that map is ready
        window.ReactNativeWebView.postMessage('mapReady');
      </script>
    </body>
    </html>
  `;

  useEffect(() => {
    // Wait a bit for the WebView to load, then send the data
    const timer = setTimeout(() => {
      if (webViewRef.current && geojsonData) {
        // Sample the data to reduce size - take every 10th point for now
        const sampledData = {
          type: 'FeatureCollection',
          features: geojsonData.features.filter((_: any, index: number) => index % 10 === 0)
        };
        
        console.log(`Sending ${sampledData.features.length} of ${geojsonData.features.length} markers`);
        
        // Send data in chunks
        const dataString = JSON.stringify(sampledData);
        webViewRef.current.injectJavaScript(`
          try {
            window.loadMarkers(${JSON.stringify(dataString)});
          } catch (e) {
            console.error('Error in WebView:', e);
          }
          true;
        `);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.webview}
        source={{ html: htmlContent }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        onMessage={(event) => {
          console.log('WebView message:', event.nativeEvent.data);
        }}
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