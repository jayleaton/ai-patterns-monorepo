import { Redirect, Stack } from 'expo-router'

import { useSession } from '@/lib/auth/authClient'

export default function AppLayout() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return null
  }

  if (!session) {
    return <Redirect href="/sign-in" />
  }

  return <Stack screenOptions={{ headerShown: false }} />
}
