import type { ReactNode } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ThemedView } from '@/components/themed-view'

/**
 * Full-height themed screen with safe-area insets applied.
 */
export function Screen({ children }: { children: ReactNode }) {
  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex}>{children}</SafeAreaView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
})
