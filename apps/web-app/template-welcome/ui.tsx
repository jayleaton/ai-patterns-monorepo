import type { ReactNode } from 'react'

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className='relative min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(96,165,250,0.12),transparent_55%)]'
      />
      <div className='relative mx-auto w-full max-w-3xl px-5 pb-16 pt-8 md:px-6 md:pb-20 md:pt-12'>
        {children}
      </div>
    </div>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className='text-xs font-medium uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300'>
      {children}
    </p>
  )
}

export function Section({
  id,
  children,
}: {
  id?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className='scroll-mt-24 mt-10 border-t border-neutral-200/80 pt-14 pb-14 dark:border-neutral-800 md:mt-12'
    >
      {children}
    </section>
  )
}
