import { StyleSheet, ScrollView, View, Switch, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MetricCard } from '@/components/MetricCard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';


export default function HomeScreen() {
  const [showUserDataOnly, setShowUserDataOnly] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const switchTrackColor = useThemeColor({}, 'tabIconDefault');
  const switchThumbColor = useThemeColor({}, 'tint');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const placeholderData = {
    sightings: showUserDataOnly ? 12 : 347,
    killed: showUserDataOnly ? 8 : 213,
    nests: showUserDataOnly ? 3 : 45,
    patrols: showUserDataOnly ? 5 : 89,
  };

  const userLat = location?.coords.latitude || 40.7128;
  const userLng = location?.coords.longitude || -74.0060;
  const hasLocation = !!location;

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        body { margin: 0; padding: 0; }
        #map { width: 100vw; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        // Initialize map with user location from React Native
        const userLat = ${userLat};
        const userLng = ${userLng};
        const hasLocation = ${hasLocation};
        
        const map = L.map('map', { zoomControl: false }).setView([userLat, userLng], hasLocation ? 13 : 10);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
          maxZoom: 19
        }).addTo(map);
        
        // Add user location marker if available
        if (hasLocation) {
          L.circleMarker([userLat, userLng], {
            radius: 8,
            fillColor: '#007AFF',
            color: 'white',
            weight: 3,
            opacity: 1,
            fillOpacity: 1
          }).addTo(map);
          
          // Add pulsing effect
          L.circle([userLat, userLng], {
            radius: 20,
            fillColor: '#007AFF',
            color: '#007AFF',
            weight: 1,
            opacity: 0.3,
            fillOpacity: 0.15,
            className: 'pulse-circle'
          }).addTo(map);
        }
      </script>
    </body>
    </html>
  `;


  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" style={styles.title}>
          Lanternfly Impact Metrics
        </ThemedText>
        
        <View style={styles.toggleContainer}>
          <ThemedText style={styles.toggleLabel}>
            {showUserDataOnly ? 'My Data' : 'All Data'}
          </ThemedText>
          <Switch
            value={showUserDataOnly}
            onValueChange={setShowUserDataOnly}
            trackColor={{ false: switchTrackColor, true: switchThumbColor }}
            thumbColor={showUserDataOnly ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.cardsContainer}>
          <MetricCard
            title="Total Sightings"
            value={placeholderData.sightings}
            icon="👁️"
          />
          <MetricCard
            title="Lanternflies Killed"
            value={placeholderData.killed}
            icon="🎯"
          />
          <MetricCard
            title="Egg Nests Destroyed"
            value={placeholderData.nests}
            icon="🥚"
          />
          <MetricCard
            title="Total Patrols"
            value={placeholderData.patrols}
            icon="🚶"
          />
        </View>

        <View style={styles.mapContainer}>
          <WebView
            style={styles.map}
            source={{ html: mapHtml }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 12,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  mapContainer: {
    height: 200,
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});