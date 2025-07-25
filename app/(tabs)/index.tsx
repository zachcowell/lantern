import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function MapScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Map</ThemedText>
      <ThemedText style={styles.placeholder}>
        Live sightings map will be displayed here
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  placeholder: {
    marginTop: 20,
    textAlign: 'center',
  },
});