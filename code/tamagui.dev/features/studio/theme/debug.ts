export const dumpThemeState = () => {
  const store = globalThis['themeBuilderStore']
  if (!store) return null

  return {
    // ThemeSuiteItemの構造に基づいたダンプ
    currentState: {
      name: store.name,
      schemes: store.schemes,
      palettes: store.palettes,
      templateStrategy: store.templateStrategy,
    },
    // その他の重要な状態
    themeSuiteVersion: store.themeSuiteVersion,
    themeSuiteId: store.themeSuiteId,
    currentQuery: store.currentQuery,
  }
}

// これをDBに保存する。
type ThemeHistoryData = {
  name: string
  palettes: {
    base: {
      name: 'base'
      anchors: Array<{
        index: number
        hue: { light: number; dark: number; sync?: boolean; syncLeft?: boolean }
        sat: { light: number; dark: number; sync?: boolean }
        lum: { light: number; dark: number }
      }>
    }
    accent: {
      name: 'accent'
      anchors: Array<{
        /* 同上 */
      }>
    }
  }
  schemes: {
    light: boolean
    dark: boolean
  }
  templateStrategy: 'base'
}
