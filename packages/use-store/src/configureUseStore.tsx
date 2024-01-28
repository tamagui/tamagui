import type { UseStoreConfig } from './interfaces'

export let configureOpts: UseStoreConfig = {}

export function configureUseStore(opts: UseStoreConfig) {
  configureOpts = opts
}
