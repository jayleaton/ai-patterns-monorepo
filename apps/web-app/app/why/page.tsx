// TEMPLATE: delete this folder with apps/web-app/template-welcome
import { notFound } from 'next/navigation'
import { FeatureConfig } from '@/lib/config/featureToggles'
import { WhyPatternsPage } from '@/template-welcome/WhyPatternsPage'

export const metadata = {
  title: 'Why these patterns',
  description:
    'A short, beginner-friendly explanation of the design choices in this template.',
}

export default async function WhyPage() {
  if (!FeatureConfig.features.templateWelcome) {
    notFound()
  }

  return <WhyPatternsPage />
}
