import { useEffect } from 'react'

export function useOnUnmount(cb: () => void) {
  useEffect(() => {
    return cb
  }, [])
}
