import { useEffect } from 'react'

export function useOnMount(cb: Function) {
  useEffect(() => {
    cb()
  }, [])
}
