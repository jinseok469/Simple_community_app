import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
   <ThemedView style={styles.container}></ThemedView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});