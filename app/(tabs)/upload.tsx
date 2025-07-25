import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function UploadScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Upload</ThemedText>
      <ThemedText style={styles.placeholder}>
        Photo upload interface will be displayed here
      </ThemedText>
      <ThemedText style={styles.placeholder}>
        Geo-tagging functionality will be added
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