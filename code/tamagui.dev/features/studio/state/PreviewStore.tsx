import { createStore } from '@tamagui/use-store'
import { themesStore } from './ThemesStore'
import type { ThemeVal } from './types'

type PreviewMode = 'inspect' | 'pin'

export class PreviewStore {
  mode: PreviewMode = 'inspect'
  rect: DOMRect | null = null
  node: HTMLElement | null = null
  selectedTheme: ThemeVal | null = null

  get nodeName() {
    if (!this.node) {
      return null
    }

    // @ts-ignore
    return [...this.node.classList]
      .find((x) => x.startsWith('is_'))
      ?.replace('is_', '')
      .trim()
  }

  setMode(mode: PreviewMode) {
    this.mode = mode
  }

  setNode(node: HTMLElement | null) {
    this.rect = node?.getBoundingClientRect() ?? null
    this.node = node
    if (node === null) {
      this.mode = 'inspect'
    } else {
      // we want to just set a preview theme not change the full theme
      // or if we do set it here i think we need to prefix with dark_ light_
      // themesStore.toggleFocusedThemeItem({
      //   id: this.nodeName as any,
      // })
      if (this.nodeName) {
        this.selectedTheme = themesStore.themeVals[this.nodeName]
      }
    }
  }
}

export const previewStore = createStore(PreviewStore)
