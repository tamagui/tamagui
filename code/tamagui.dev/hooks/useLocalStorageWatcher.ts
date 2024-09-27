import { useState, useEffect, useCallback } from 'react'

/**
 * This is useful for syncing state between components on the same page.
 */
export function useLocalStorageWatcher(key: string, defaultValue: string) {
  const [isMounted, setIsMounted] = useState(false)
  const [storageItem, setStorageItem] = useState(defaultValue)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleStorageChange = useCallback(
    (e: StorageEvent | CustomEvent) => {
      if ('key' in e && e.key === key) {
        setStorageItem(e.newValue || defaultValue)
      } else if ('detail' in e && e.detail.key === key) {
        setStorageItem(e.detail.newValue || defaultValue)
      }
    },
    [key, defaultValue]
  )

  useEffect(() => {
    if (!isMounted) {
      return
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      setStorageItem(localStorage.getItem(key) || defaultValue)
      window.addEventListener('storage', handleStorageChange)
      window.addEventListener('localStorageChange', handleStorageChange as EventListener)
      return () => {
        window.removeEventListener('storage', handleStorageChange)
        window.removeEventListener(
          'localStorageChange',
          handleStorageChange as EventListener
        )
      }
    }
  }, [key, isMounted, defaultValue, handleStorageChange])

  return {
    storageItem,
    setItem: (newValue: string) => {
      localStorage.setItem(key, newValue)
      window.dispatchEvent(
        new CustomEvent('localStorageChange', {
          detail: {
            key: key,
            oldValue: storageItem,
            newValue: newValue,
          },
        })
      )
      setStorageItem(newValue)
    },
  }
}
