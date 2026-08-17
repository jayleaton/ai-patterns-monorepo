// @feature:template-welcome @frontend
// REMOVABLE_FEATURE: Template welcome landing. See template-welcome/README.md

import Link from 'next/link'
import { AppRoutes } from '@/lib/config/featureToggles'
import { getTemplateCopy } from './copy'
import { Eyebrow, Section, Shell } from './ui'

export async function LandingPage() {
  const t = await getTemplateCopy()

  return (
    <Shell>
      <header className='space-y-6 pb-2'>
        <p className='inline-flex rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-medium text-blue-800 dark:border-blue-900 dark:bg-neutral-900 dark:text-blue-200'>
          {t.hero.badge}
        </p>
        <h1 className='text-[2rem] font-semibold leading-tight tracking-tight text-neutral-950 sm:text-4xl md:text-5xl dark:text-white'>
          {t.hero.title}
        </h1>
        <p className='max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-300'>
          {t.hero.subtitle}
        </p>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
          <Link
            href={AppRoutes.signup}
            className='inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600/90 dark:bg-blue-500 dark:hover:bg-blue-400'
          >
            {t.hero.primary}
          </Link>
          <Link
            href={AppRoutes.login}
            className='inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800'
          >
            {t.hero.secondary}
          </Link>
          <a
            href='#start'
            className='inline-flex items-center justify-center px-2 py-3 text-sm font-medium text-neutral-600 underline-offset-4 hover:underline dark:text-neutral-300'
          >
            {t.hero.skip}
          </a>
        </div>
      </header>

      <Section>
        <Eyebrow>{t.what.eyebrow}</Eyebrow>
        <h2 className='mt-3 text-2xl font-semibold tracking-tight md:text-3xl'>
          {t.what.title}
        </h2>
        <p className='mt-3 max-w-2xl leading-relaxed text-neutral-600 dark:text-neutral-300'>
          {t.what.body}
        </p>
        <ul className='mt-8 grid gap-4 sm:grid-cols-3'>
          {t.what.cards.map(card => (
            <li
              key={card.title}
              className='rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900'
            >
              <h3 className='font-semibold text-neutral-950 dark:text-white'>
                {card.title}
              </h3>
              <p className='mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300'>
                {card.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id='start'>
        <Eyebrow>{t.start.eyebrow}</Eyebrow>
        <h2 className='mt-3 text-2xl font-semibold tracking-tight md:text-3xl'>
          {t.start.title}
        </h2>
        <p className='mt-3 max-w-2xl leading-relaxed text-neutral-600 dark:text-neutral-300'>
          {t.start.subtitle}
        </p>
        <ol className='mt-8 space-y-3'>
          {t.start.steps.map((step, index) => (
            <li
              key={step.title}
              className='flex gap-4 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900'
            >
              <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-sm font-semibold text-white dark:bg-white dark:text-neutral-950'>
                {index + 1}
              </span>
              <div>
                <h3 className='font-semibold text-neutral-950 dark:text-white'>
                  {step.title}
                </h3>
                <p className='mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300'>
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id='patterns'>
        <Eyebrow>{t.patterns.eyebrow}</Eyebrow>
        <h2 className='mt-3 text-2xl font-semibold tracking-tight md:text-3xl'>
          {t.patterns.title}
        </h2>
        <p className='mt-3 max-w-2xl leading-relaxed text-neutral-600 dark:text-neutral-300'>
          {t.patterns.subtitle}
        </p>
        <ul className='mt-8 grid gap-4 sm:grid-cols-2'>
          {t.patterns.items.map(item => (
            <li
              key={item.title}
              className='rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900'
            >
              <h3 className='font-semibold text-neutral-950 dark:text-white'>
                {item.title}
              </h3>
              <p className='mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300'>
                {item.body}
              </p>
              <p className='mt-4 break-all font-mono text-xs text-neutral-500 dark:text-neutral-400'>
                {item.path}
              </p>
            </li>
          ))}
        </ul>
        <p className='mt-6'>
          <Link
            href={AppRoutes.why}
            className='text-sm font-medium text-blue-700 underline-offset-4 hover:underline dark:text-blue-300'
          >
            {t.patterns.more}
          </Link>
        </p>
      </Section>

      <Section>
        <Eyebrow>{t.later.eyebrow}</Eyebrow>
        <h2 className='mt-3 text-2xl font-semibold tracking-tight md:text-3xl'>
          {t.later.title}
        </h2>
        <ul className='mt-8 space-y-4'>
          {t.later.items.map(item => (
            <li key={item.title}>
              <h3 className='font-semibold text-neutral-950 dark:text-white'>
                {item.title}
              </h3>
              <p className='mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300'>
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id='remove'>
        <div className='rounded-2xl border border-dashed border-neutral-400 bg-white p-6 dark:border-neutral-600 dark:bg-neutral-900'>
          <Eyebrow>{t.remove.eyebrow}</Eyebrow>
          <h2 className='mt-3 text-2xl font-semibold tracking-tight'>
            {t.remove.title}
          </h2>
          <p className='mt-3 leading-relaxed text-neutral-600 dark:text-neutral-300'>
            {t.remove.body}
          </p>
          <ol className='mt-6 space-y-3'>
            {t.remove.steps.map((step, index) => (
              <li key={step} className='flex gap-3 text-sm leading-relaxed'>
                <span className='font-semibold text-neutral-950 dark:text-white'>
                  {index + 1}.
                </span>
                <span className='text-neutral-700 dark:text-neutral-300'>
                  {step}
                </span>
              </li>
            ))}
          </ol>
          <p className='mt-5 text-sm text-neutral-500 dark:text-neutral-400'>
            {t.remove.note}
          </p>
        </div>
      </Section>

      <footer className='mt-10 flex flex-col gap-3 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between dark:text-neutral-400'>
        <span>{t.footer.brand}</span>
        <nav className='flex flex-wrap gap-4'>
          <Link href={AppRoutes.why} className='hover:text-neutral-900 dark:hover:text-white'>
            {t.footer.why}
          </Link>
          <Link href={AppRoutes.login} className='hover:text-neutral-900 dark:hover:text-white'>
            {t.footer.login}
          </Link>
          <Link href={AppRoutes.signup} className='hover:text-neutral-900 dark:hover:text-white'>
            {t.footer.signup}
          </Link>
        </nav>
      </footer>
    </Shell>
  )
}
