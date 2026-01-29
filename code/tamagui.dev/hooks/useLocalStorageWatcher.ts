import { useCallback, useSyncExternalStore } from 'react'

/**
 * This is useful for syncing state between components on the same page.
 * Uses useSyncExternalStore for SSR safety.
 */
export function useLocalStorageWatcher(key: string, defaultValue: string) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === key) {
          onStoreChange()
        }
      }
      const handleCustomChange = (e: Event) => {
        const customEvent = e as CustomEvent
        if (customEvent.detail?.key === key) {
          onStoreChange()
        }
      }
      window.addEventListener('storage', handleStorageChange)
      window.addEventListener('localStorageChange', handleCustomChange)
      return () => {
        window.removeEventListener('storage', handleStorageChange)
        window.removeEventListener('localStorageChange', handleCustomChange)
      }
    },
    [key]
  )

  const getSnapshot = useCallback(() => {
    return localStorage.getItem(key) || defaultValue
  }, [key, defaultValue])

  const getServerSnapshot = useCallback(() => {
    return defaultValue
  }, [defaultValue])

  const storageItem = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setItem = useCallback(
    (newValue: string) => {
      localStorage.setItem(key, newValue)
      window.dispatchEvent(
        new CustomEvent('localStorageChange', {
          detail: {
            key: key,
            newValue: newValue,
          },
        })
      )
    },
    [key]
  )

  return {
    storageItem,
    setItem,
  }
}
