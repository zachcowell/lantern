import { StyleSheet, ScrollView, View, Switch, Text, useColorScheme } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MetricCard } from '@/components/MetricCard';
import { useThemeColor } from '@/hooks/useThemeColor';
import MapView, { Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#212121' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#212121' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#2c2c2c' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }],
  },
];

export default function HomeScreen() {
  const [showUserDataOnly, setShowUserDataOnly] = useState(false);
  const switchTrackColor = useThemeColor({}, 'tabIconDefault');
  const switchThumbColor = useThemeColor({}, 'tint');
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const colorScheme = useColorScheme();
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 40.7128,
    longitude: -74.0060,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const placeholderData = {
    sightings: showUserDataOnly ? 12 : 347,
    killed: showUserDataOnly ? 8 : 213,
    nests: showUserDataOnly ? 3 : 45,
    patrols: showUserDataOnly ? 5 : 89,
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          let location = await Location.getCurrentPositionAsync({});
          setMapRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        } catch (error) {
          // Keep default location if error
        }
      }
    })();
  }, []);

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
          <View style={styles.mapWrapper}>
            <MapView
              ref={mapRef}
              style={styles.map}
              region={mapRegion}
              showsUserLocation={true}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
              customMapStyle={colorScheme === 'dark' ? darkMapStyle : undefined}
            />
          </View>
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
    marginBottom: 8,
  },
  mapContainer: {
    marginTop: 0,
  },
  mapWrapper: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});