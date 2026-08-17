'use client'

import { setLanguageAction } from '@/actions/language-actions'
import { locales, type Locale } from '@/lib/i18n/constants'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useId, useRef, useState, useTransition } from 'react'

export function LanguageSelector() {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const currentLocale = useLocale() as Locale
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const handleLanguageChange = (locale: Locale) => {
    if (locale === currentLocale) {
      setIsOpen(false)
      return
    }

    startTransition(async () => {
      try {
        await setLanguageAction(locale)
      } catch (error) {
        console.error('Failed to change language:', error)
      }
    })
    setIsOpen(false)
  }

  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  const commonT = useTranslations('common')
  const componentT = useTranslations('components.languageSelector')

  const getLanguageLabel = (locale: Locale): string => {
    switch (locale) {
      case 'en':
        return commonT('english')
      case 'ja':
        return commonT('japanese')
      default:
        return locale
    }
  }

  const getLanguageShort = (locale: Locale): string => {
    return locale.toUpperCase()
  }

  return (
    <div className='relative' ref={rootRef}>
      <button
        type='button'
        onClick={() => setIsOpen(open => !open)}
        disabled={isPending}
        aria-label={componentT('language')}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        aria-controls={menuId}
        className='inline-flex h-9 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2.5 text-sm font-medium text-neutral-800 shadow-sm hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800'
      >
        <span>{getLanguageShort(currentLocale)}</span>
        <svg
          className={`h-3.5 w-3.5 text-neutral-500 transition-transform dark:text-neutral-400 ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>

      {isOpen && (
        <ul
          id={menuId}
          role='listbox'
          aria-label={componentT('language')}
          className='absolute right-0 z-50 mt-1 min-w-[10.5rem] overflow-hidden rounded-md border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900'
        >
          {locales.map(locale => {
            const selected = locale === currentLocale
            return (
              <li key={locale} role='option' aria-selected={selected}>
                <button
                  type='button'
                  onClick={() => handleLanguageChange(locale)}
                  disabled={isPending}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm disabled:opacity-50 ${
                    selected
                      ? 'bg-neutral-100 font-medium text-neutral-950 dark:bg-neutral-800 dark:text-white'
                      : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span>{getLanguageLabel(locale)}</span>
                  <span className='text-xs text-neutral-400 dark:text-neutral-500'>
                    {getLanguageShort(locale)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
