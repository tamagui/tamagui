import { createStore } from '@tamagui/use-store'
import { defaultThemeSuiteItem } from './defaultThemeSuiteItem'
import type { ThemeSuiteItemData } from './types'

const defaultProps: ThemePageProps = {
  search: '',
  id: 0,
  theme: defaultThemeSuiteItem,
  user_name: null,
}

export type ThemePageProps = {
  search: string
  id: number
  theme: ThemeSuiteItemData
  user_name: string | null
}

export class ThemePageStore {
  curProps: ThemePageProps = defaultProps

  setProps(_: ThemePageProps) {
    this.curProps = _
  }

  reset() {
    this.curProps = defaultProps
  }
}

export const themePageStore = createStore(ThemePageStore)
