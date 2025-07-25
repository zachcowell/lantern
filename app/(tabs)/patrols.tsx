import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function PatrolsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Patrols</ThemedText>
      <ThemedText style={styles.placeholder}>
        Historical patrols list will be displayed here
      </ThemedText>
      <ThemedText style={styles.placeholder}>
        Start New Patrol button will be added here
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