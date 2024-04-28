import { useGlobalStore } from '@tamagui/use-store'

import type { AnimationsStore } from './AnimationsStore'
import { animationsStore } from './AnimationsStore'
import type { ColorsStore } from './ColorsStore'
import { colorsStore } from './ColorsStore'
import type { PreviewStore } from './PreviewStore'
import { previewStore } from './PreviewStore'
import type { RootStore } from './RootStore'
import { rootStore } from './RootStore'
import type { SettingsStore } from './SettingsStore'
import { settingsStore } from './SettingsStore'
import type { SidePaneStore } from './SidePaneStore'
import { sidePaneStore } from './SidePaneStore'
import type { ThemesStore } from './ThemesStore'
import { themesStore } from './ThemesStore'
import type { TokensStore } from './TokensStore'
import { tokensStore } from './TokensStore'

const allStores = {
  rootStore,
  colorsStore,
  themesStore,
  sidePaneStore,
  animationsStore,
  settingsStore,
  tokensStore,
  previewStore,
}

export const useRootStore = (options?: { debug?: boolean }) =>
  useGlobalStore(rootStore, options?.debug)
export const useColorsStore = (options?: { debug?: boolean }) =>
  useGlobalStore(colorsStore, options?.debug)
export const useThemesStore = (options?: { debug?: boolean }) =>
  useGlobalStore(themesStore, options?.debug)
export const useSidePaneStore = (options?: { debug?: boolean }) =>
  useGlobalStore(sidePaneStore, options?.debug)
export const useAnimationsStore = (options?: { debug?: boolean }) =>
  useGlobalStore(animationsStore, options?.debug)
export const useSettingsStore = (options?: { debug?: boolean }) =>
  useGlobalStore(settingsStore, options?.debug)
export const useTokensStore = (options?: { debug?: boolean }) =>
  useGlobalStore(tokensStore, options?.debug)
export const usePreviewStore = (options?: { debug?: boolean }) =>
  useGlobalStore(previewStore, options?.debug)

export const useGlobalState = (options?: { debug?: boolean }) => {
  return combineStores({
    rootStore: useRootStore(options),
    colorsStore: useColorsStore(options),
    themesStore: useThemesStore(options),
    sidePaneStore: useSidePaneStore(options),
    animationsStore: useAnimationsStore(options),
    settingsStore: useSettingsStore(options),
    tokensStore: useTokensStore(options),
    previewStore: usePreviewStore(options),
  })
}

const globalStores = combineStores(allStores)

function combineStores(stores: typeof allStores) {
  const storeKeys = new Set(Object.keys(stores).map((k) => k.replace(/Store$/, '')))
  return new Proxy(stores, {
    get(_, key: string) {
      if (storeKeys.has(key)) {
        return Reflect.get(stores, `${key}Store`)
      }
      return Reflect.get(stores.rootStore, key)
    },
  }) as any as RootStore & {
    themes: ThemesStore
    colors: ColorsStore
    sidePane: SidePaneStore
    animations: AnimationsStore
    settings: SettingsStore
    tokens: TokensStore
    preview: PreviewStore
  }
}

// set for easy debugging
globalThis['state'] = globalStores
for (const key in allStores) {
  if (!(key in globalThis)) {
    globalThis[key] = allStores[key]
  }
}
