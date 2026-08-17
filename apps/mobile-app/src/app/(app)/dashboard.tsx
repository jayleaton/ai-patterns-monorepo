import { useCallback, useEffect, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native'

import { AppButton } from '@/components/app-button'
import { Screen } from '@/components/screen'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Spacing } from '@/constants/theme'
import { signOut, useSession } from '@/lib/auth/authClient'
import { getCurrentUser, type CurrentUserResponse } from '@/lib/services/userService'

/**
 * Protected home screen. Doubles as the canonical example of calling the
 * web app's envelope API (`GET /api/core/v1/users`) with the mobile
 * session: success renders the data card, failures render the envelope
 * error or the unreachable-network ApiError.
 */
export default function DashboardScreen() {
  const { data: session } = useSession()
  const [envelope, setEnvelope] = useState<CurrentUserResponse | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchCurrentUser = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      setEnvelope(await getCurrentUser())
    } catch (error) {
      setEnvelope(null)
      setFetchError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  const apiUser = envelope?.data?.user

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchCurrentUser} />
        }
      >
        <ThemedText type="title">Dashboard</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.subtitle}>
          Signed in as {session?.user.email}
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold">GET /api/core/v1/users</ThemedText>

          {apiUser ? (
            <View style={styles.cardBody}>
              <ThemedText themeColor="textSecondary" type="small">
                id: {apiUser.id}
              </ThemedText>
              <ThemedText themeColor="textSecondary" type="small">
                name: {apiUser.name}
              </ThemedText>
              <ThemedText themeColor="textSecondary" type="small">
                email: {apiUser.email}
              </ThemedText>
              <ThemedText themeColor="textSecondary" type="small">
                emailVerified: {String(apiUser.emailVerified)}
              </ThemedText>
            </View>
          ) : envelope?.error ? (
            <ThemedText style={styles.errorText}>{envelope.error}</ThemedText>
          ) : fetchError ? (
            <ThemedText style={styles.errorText}>{fetchError}</ThemedText>
          ) : (
            <ThemedText themeColor="textSecondary" type="small">
              Loading…
            </ThemedText>
          )}
        </ThemedView>

        <AppButton variant="secondary" label="Call API again" onPress={fetchCurrentUser} disabled={loading} />
        <AppButton
          label="Sign out"
          variant="secondary"
          onPress={() => signOut()}
          disabled={loading}
        />
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.three,
    padding: Spacing.four,
  },
  subtitle: {
    marginBottom: Spacing.two,
  },
  card: {
    borderRadius: 12,
    gap: Spacing.two,
    padding: Spacing.four,
  },
  cardBody: {
    gap: Spacing.one,
  },
  errorText: {
    color: '#e5484d',
    fontSize: 14,
  },
})
