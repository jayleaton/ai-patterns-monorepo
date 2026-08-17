import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { auth } from '@/lib/auth/auth'
import { AppRoutes, FeatureConfig } from '@/lib/config/featureToggles'
// TEMPLATE: delete this import with apps/web-app/template-welcome
import { LandingPage } from '@/template-welcome/LandingPage'

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session) redirect(AppRoutes.dashboard)

  if (FeatureConfig.features.templateWelcome) {
    return <LandingPage />
  }

  return (
    <div className='mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6'>
      <h1 className='text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white'>
        Your app is running
      </h1>
      <p className='mt-3 leading-relaxed text-neutral-600 dark:text-neutral-300'>
        The starter welcome page is turned off. Sign in, or replace this screen
        with your own homepage.
      </p>
      <div className='mt-8 flex gap-3'>
        <Link
          href={AppRoutes.signup}
          className='rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white'
        >
          Sign up
        </Link>
        <Link
          href={AppRoutes.login}
          className='rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium dark:border-neutral-700'
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}
