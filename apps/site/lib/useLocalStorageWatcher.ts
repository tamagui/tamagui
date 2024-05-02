import { useState, useEffect } from 'react'

/**
 * This is useful for syncing state between components on the same page.
 */
export function useLocalStorageWatcher(key: string, defaultValue: string) {
  const [isMounted, setIsMounted] = useState(false)
  const [storageItem, setStorageItem] = useState(defaultValue)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) {
      return
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        setStorageItem(e.newValue || defaultValue)
      }
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      setStorageItem(localStorage.getItem(key) || defaultValue)
      window.addEventListener('storage', handleStorageChange)
      return () => window.removeEventListener('storage', handleStorageChange)
    }
  }, [key, isMounted, defaultValue])

  return {
    storageItem,
    setItem: (newValue: string) => {
      localStorage.setItem(key, newValue)
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: key,
          oldValue: storageItem,
          newValue: newValue,
        })
      )
      setStorageItem(newValue)
    },
  }
}
