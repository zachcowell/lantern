import { StyleSheet, ScrollView, View, Switch, Text } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MetricCard } from '@/components/MetricCard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function HomeScreen() {
  const [showUserDataOnly, setShowUserDataOnly] = useState(false);
  const switchTrackColor = useThemeColor({}, 'tabIconDefault');
  const switchThumbColor = useThemeColor({}, 'tint');
  const insets = useSafeAreaInsets();

  const placeholderData = {
    sightings: showUserDataOnly ? 12 : 347,
    killed: showUserDataOnly ? 8 : 213,
    nests: showUserDataOnly ? 3 : 45,
    patrols: showUserDataOnly ? 5 : 89,
  };


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
    marginBottom: 24,
  },
});