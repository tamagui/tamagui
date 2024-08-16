import React from 'react'
import { getSetting } from '../config'

let didHydrateOnce = false

export function useDidHydrateOnceRoot() {
  // useEffect(() => {
  //   const tm = setInterval(() => {
  //     if (Date.now() - last > 50) {
  //       didHydrateOnce = true
  //       clearInterval(tm)
  //     }
  //   }, 16)
  //   return () => {
  //     clearInterval(tm)
  //   }
  // }, [])
  return true
}

let last = Date.now()

export function useDidHydrateOnce() {
  if (process.env.TAMAGUI_TARGET !== 'web') {
    return true
  }
  if (getSetting('disableSSR')) {
    return true
  }
  // if (process.env.TAMAGUI_REACT_19) {
  // if (!didHydrateOnce) {
  //   last = Date.now()
  // }
  // }
  return useDidHydrateSync()
}

const emptySubscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false
const useDidHydrateSync = () =>
  React.useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot)
