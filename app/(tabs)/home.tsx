import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Home</ThemedText>
      <ThemedText style={styles.placeholder}>
        User metrics will be displayed here:
      </ThemedText>
      <ThemedText style={styles.placeholder}>
        • Total lanternfly sightings
      </ThemedText>
      <ThemedText style={styles.placeholder}>
        • Total lanternflies killed
      </ThemedText>
      <ThemedText style={styles.placeholder}>
        • Egg nests destroyed
      </ThemedText>
      <ThemedText style={styles.placeholder}>
        • Total number of patrols
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
    marginTop: 10,
    textAlign: 'center',
  },
});