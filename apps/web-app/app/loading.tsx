export default function Loading() {
  return (
    <div className='mx-auto max-w-3xl px-5 pt-28'>
      <div className='h-8 w-40 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800' />
      <div className='mt-6 h-12 w-3/4 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800' />
      <div className='mt-4 h-24 w-full animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-900' />
    </div>
  )
}
