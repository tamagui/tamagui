import { createContext } from 'react'

export class ThemeManager {
  name: string | null = 'light'
  parentName: string | null = null
  keys = new Map<any, Set<string>>()
  listeners = new Map<any, Function>()
  callbacks = new Set<Function>()
  theme = null

  setActiveTheme({
    name,
    theme,
    parentName,
  }: {
    parentName?: string | null
    name: string | null
    theme?: any
  }) {
    if (name === this.name) return
    this.name = name
    this.theme = theme
    this.parentName = parentName || null
    this.update()
  }

  track(uuid: any, keys: Set<string>) {
    if (!this.name) return
    this.keys.set(uuid, keys)
  }

  update() {
    if (!this.name) {
      this.keys.clear()
    }
    for (const [uuid, keys] of this.keys.entries()) {
      if (keys.size) {
        this.listeners.get(uuid)?.()
      }
    }
    this.callbacks.forEach((cb) => cb(this.name))
  }

  onChangeTheme(cb: (name: string | null) => void) {
    this.callbacks.add(cb)
    return () => {
      this.callbacks.delete(cb)
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
