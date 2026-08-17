import { Redirect } from 'expo-router'

import { useSession } from '@/lib/auth/authClient'

/**
 * Entry route. Sends authenticated users to the dashboard and everyone
 * else to sign-in. The group layouts re-check the session on every
 * navigation so signing out lands you back here.
 */
export default function Index() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return null
  }

  return <Redirect href={session ? '/dashboard' : '/sign-in'} />
}
