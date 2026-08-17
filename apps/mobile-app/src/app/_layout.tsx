import { useEffect } from 'react'
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'react-native'

import { useSession } from '@/lib/auth/authClient'

SplashScreen.preventAutoHideAsync()

/**
 * Root layout: applies the color scheme theme and keeps the splash screen
 * visible while the session is restored from SecureStore.
 */
export default function RootLayout() {
  const colorScheme = useColorScheme()
  const { isPending } = useSession()

  useEffect(() => {
    if (!isPending) {
      SplashScreen.hideAsync()
    }
  }, [isPending])

  if (isPending) {
    return null
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  )
}
