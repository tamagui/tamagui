import { useEffect, useState, useSyncExternalStore } from 'react'

const emptySubscribe = () => {
  return () => {}
}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export function useDidHydrateOnce() {
  if (process.env.TAMAGUI_TARGET !== 'web') {
    return true
  }
  // opt into async hydration, can have better initial mount perf but worse ongoing (a bit unintuitively)
  if (process.env.TAMAGUI_ASYNC_IS_HYDRATED) {
    const [state, setState] = useState(false)
    useEffect(() => {
      setState(true)
    }, [])
    return state
  }
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot)
}
