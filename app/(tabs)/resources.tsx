import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ResourcesScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Resources</ThemedText>
      <ThemedText style={styles.placeholder}>
        USDA.gov resources will be displayed here
      </ThemedText>
      <ThemedText style={styles.placeholder}>
        Amazon affiliate links for equipment will be listed here
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