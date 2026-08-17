import { Redirect, Stack } from 'expo-router'

import { useSession } from '@/lib/auth/authClient'

export default function AuthLayout() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return null
  }

  if (session) {
    return <Redirect href="/dashboard" />
  }

  return <Stack screenOptions={{ headerShown: false }} />
}
