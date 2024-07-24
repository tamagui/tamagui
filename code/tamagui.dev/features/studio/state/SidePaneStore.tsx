import { createStore } from '@tamagui/use-store'
import type { ConfigSubPane } from './types'

export class SidePaneStore {
  panes: ConfigSubPane[] = []
  current: ConfigSubPane | null = null

  push(newKey: ConfigSubPane) {
    this.panes.push(newKey)
    this.panes = [...this.panes]
    this.current = newKey
  }
  replace(key: ConfigSubPane) {
    this.panes = [key]
    this.current = key
  }
  pop() {
    this.panes.pop()
    this.panes = [...this.panes]
    this.current = this.panes[this.panes.length - 1] ?? null
  }

  close() {
    this.panes = []
    this.current = null
  }
}

export const sidePaneStore = createStore(SidePaneStore)
