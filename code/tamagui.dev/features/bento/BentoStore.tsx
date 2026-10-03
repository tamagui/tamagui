import { createStore, createUseStore } from '@tamagui/use-store'

class BentoStore {
  heroVisible = true
  heroHeight = 800
  disableTint = true
  disableCustomTheme = false

  // bumped by the theme builder every time it applies a new custom theme suite.
  // it lives here rather than on ThemeBuilderStore because useSiteTheme reads it
  // on every page, and the builder's store pulls in the whole editor.
  themeSuiteVersion = 0

  get themeSuiteUID() {
    return this.themeSuiteVersion ? String(this.themeSuiteVersion) : ''
  }
}

export const bentoStore = createStore(BentoStore)

export const useBentoStore = createUseStore(BentoStore)
