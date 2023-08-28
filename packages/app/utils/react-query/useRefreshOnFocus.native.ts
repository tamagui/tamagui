import { useFocusEffect } from 'expo-router'
import { useCallback, useRef } from 'react'

/**
 * only works on native - on web this is done using react-query's options
 */
export function useRefreshOnFocus<T>(refetch: () => Promise<T>) {
  const firstTimeRef = useRef(true)

  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false
        return
      }

      refetch()
    }, [refetch])
  )
}
