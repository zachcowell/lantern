import { StyleSheet, View, Text } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface MetricCardProps {
  title: string;
  value: number;
  icon?: string;
}

export function MetricCard({ title, value, icon }: MetricCardProps) {
  const backgroundColor = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'tabIconDefault');

  return (
    <ThemedView style={[styles.card, { backgroundColor, borderColor }]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <ThemedText type="title" style={styles.value}>
        {value.toLocaleString()}
      </ThemedText>
      <ThemedText style={styles.title}>{title}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
});