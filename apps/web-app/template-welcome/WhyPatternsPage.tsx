// @feature:template-welcome @frontend
// REMOVABLE_FEATURE: Template welcome landing. See template-welcome/README.md

import Link from 'next/link'
import { AppRoutes } from '@/lib/config/featureToggles'
import { getTemplateCopy } from './copy'
import { Eyebrow, Shell } from './ui'

export async function WhyPatternsPage() {
  const t = await getTemplateCopy()

  return (
    <Shell>
      <header className='space-y-5'>
        <Eyebrow>{t.why.eyebrow}</Eyebrow>
        <h1 className='text-[2rem] font-semibold leading-tight tracking-tight text-neutral-950 sm:text-4xl md:text-5xl dark:text-white'>
          {t.why.title}
        </h1>
        <p className='max-w-2xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-300'>
          {t.why.subtitle}
        </p>
      </header>

      <section className='mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/60 dark:bg-amber-950/30'>
        <h2 className='text-lg font-semibold text-amber-950 dark:text-amber-100'>
          {t.why.introTitle}
        </h2>
        <p className='mt-2 leading-relaxed text-amber-900 dark:text-amber-100/90'>
          {t.why.introBody}
        </p>
      </section>

      <ol className='mt-10 space-y-6'>
        {t.why.items.map((item, index) => (
          <li
            key={item.title}
            className='rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900'
          >
            <p className='text-xs font-medium uppercase tracking-[0.16em] text-neutral-500'>
              {index + 1} / {t.why.items.length}
            </p>
            <h2 className='mt-2 text-xl font-semibold text-neutral-950 dark:text-white'>
              {item.title}
            </h2>
            <p className='mt-3 leading-relaxed text-neutral-600 dark:text-neutral-300'>
              {item.analogy}
            </p>
            <p className='mt-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200'>
              {item.lookHere}
            </p>
            <p className='mt-3 break-all font-mono text-xs text-neutral-500 dark:text-neutral-400'>
              {item.path}
            </p>
          </li>
        ))}
      </ol>

      <div className='mt-12 flex flex-col gap-3 sm:flex-row'>
        <Link
          href={AppRoutes.home}
          className='inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800'
        >
          {t.why.back}
        </Link>
        <Link
          href={AppRoutes.signup}
          className='inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-600/90 dark:bg-blue-500'
        >
          {t.why.start}
        </Link>
      </div>
    </Shell>
  )
}
