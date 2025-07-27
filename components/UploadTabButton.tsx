import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface UploadTabButtonProps {
  onPress?: () => void;
  accessibilityState?: any;
}

export function UploadTabButton({ onPress, accessibilityState }: UploadTabButtonProps) {
  const colorScheme = useColorScheme();
  const selected = accessibilityState?.selected;
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.8}
    >
      <View style={[
        styles.button,
        {
          backgroundColor: selected 
            ? Colors[colorScheme ?? 'light'].tint 
            : Colors[colorScheme ?? 'light'].tint,
          shadowColor: Colors[colorScheme ?? 'light'].tint,
        }
      ]}>
        <Text style={styles.plus}>+</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  plus: {
    fontSize: 32,
    fontWeight: '300',
    color: 'white',
  },
});