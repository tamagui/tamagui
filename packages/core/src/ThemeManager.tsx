import { createContext } from 'react'

type ThemeListener = (name: string | null, themeManager: ThemeManager) => void

export type SetActiveThemeProps = {
  parentManager?: ThemeManager | null
  name: string | null
  theme?: any
}

export class ThemeManager {
  name: string | null = 'light'
  keys = new Map<any, Set<string>>()
  listeners = new Map<any, Function>()
  themeListeners = new Set<ThemeListener>()
  parentManager: ThemeManager | null = null
  theme = null

  get parentName() {
    return this.parentManager?.name ?? null
  }

  update({ name, theme, parentManager = null }: SetActiveThemeProps) {
    if (name === this.name && parentManager == this.parentManager) {
      return
    }
    this.name = name
    this.theme = theme
    this.parentManager = parentManager
    this.notifyListeners()
  }

  track(uuid: any, keys: Set<string>) {
    if (!this.name) return
    this.keys.set(uuid, keys)
  }

  notifyListeners() {
    if (!this.name) {
      this.keys.clear()
    }
    for (const [uuid, keys] of this.keys.entries()) {
      if (keys.size) {
        this.listeners.get(uuid)?.()
      }
    }
    this.themeListeners.forEach((cb) => cb(this.name, this))
  }

  onChangeTheme(cb: ThemeListener) {
    this.themeListeners.add(cb)
    return () => {
      this.themeListeners.delete(cb)
    }
  }

  onUpdate(uuid: any, cb: Function) {
    this.listeners.set(uuid, cb)
    return () => {
      this.listeners.delete(uuid)
      this.keys.delete(uuid)
    }
  }
}

export const ThemeManagerContext = createContext<ThemeManager>(new ThemeManager())
