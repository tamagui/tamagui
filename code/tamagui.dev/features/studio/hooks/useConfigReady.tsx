import { useObserve } from '@tamagui/use-store'
import { useEffect } from 'react'

import { isLocal } from '~/features/studio/constants'
import { rootStore } from '../state/RootStore'

/**
 * Runs when the config is ready to use - use for initializing/syncing store state based on config
 *
 * Runs a useEffect when local and reacts to fs read success when using the browser FS api
 */
export const useConfigReady = (callback: () => void) => {
  if (typeof window === 'undefined') {
    return
  }

  // isLocal is driven from an env var so ok to do conditional hooks
  if (isLocal) {
    // we assume the dummy config won't change
    useEffect(() => {
      callback()
    }, [])
  } else {
    useObserve(() => {
      if (rootStore.fsReadSucceeded) {
        callback()
      }
    })
  }
}
