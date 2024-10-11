import { createStore } from '@tamagui/use-store'
import { toHex } from 'color2k'
import { last } from 'lodash-es'
import type { ThemeParsed } from 'tamagui'
import { updateTheme } from 'tamagui'

import {
  colorToHex,
  hexToColor,
  isComponentTheme,
  removeComponentName,
} from '~/features/studio/colors/helpers'
import { colorsStore } from './ColorsStore'
import { rootStore } from './RootStore'
import type {
  PseudoKeys,
  Scale,
  ThemeCategory,
  ThemeTemplate,
  ThemeVal,
  ThemeWithCategory,
} from './types'

const pseudoKeys: PseudoKeys[] = ['Hover', 'Press', 'Focus', 'Base']

export class ThemesStore {
  static defaults = {
    background: -1,
    color: 0,
    borderColor: -2,
    shadowColor: -1,
  }
  initialized = false

  init() {
    if (this.initialized) return
    this.loadThemesFromConfig()
    this.initialized = true
  }

  showAs: 'code' | 'visual' = 'visual'
  themeToPalette = new WeakMap<ThemeParsed, Scale>()
  themeToTemplate = new WeakMap<ThemeParsed, ThemeTemplate>()
  foundTemplates: ThemeTemplate[] = []
  themeId = ''
  column = 0
  row = 0
  isPinned = false
  isFocusingSingle = false
  focusedKey = ''
  themes: Record<string, ThemeParsed> = {}

  loadThemesFromConfig() {
    if (!rootStore.config) {
      throw new Error('Config not loaded.')
    }
    this.themes = rootStore.config.themes as any

    const initialTheme = Object.keys(rootStore.config.themes)[0]
    this.setTheme(initialTheme)
    // rootStore.theme = initialTheme as ThemeName

    this.foundTemplates = []

    const nextFoundTemplateKeys = new Set<string>()

    // set up palettes and templates
    for (const themeName in this.themes) {
      const theme = this.themes[themeName]

      if (this.themeToPalette.has(theme)) {
        continue
      }

      const palette = this.getThemePalette(themeName)
      if (palette) {
        this.themeToPalette.set(theme, palette)
      }

      const template = Object.fromEntries(
        Object.entries(theme).map(([key, value]) => {
          return [key, palette?.originalValues.indexOf(`${value}`) || 0]
        })
      )

      const templateKey = JSON.stringify(template)
      if (!nextFoundTemplateKeys.has(templateKey)) {
        nextFoundTemplateKeys.add(templateKey)
        this.themeToTemplate.set(theme, template)
        this.foundTemplates.push(template)
      }
    }
  }

  get theme() {
    return this.themes[this.themeId]
  }

  get themeTemplate() {
    return this.themeToTemplate.get(this.theme)
  }

  get themeKeys() {
    if (!this.theme) return []
    return Object.keys(this.theme)
  }

  get themeKeysWithoutSpecificColors() {
    if (!this.theme) {
      return []
    }

    // hardcoding for now...
    const colors = ['red', 'orange', 'blue', 'green', 'yellow', 'purple', 'pink', 'gray']
    return Object.keys(this.theme)
      .filter((x) => x !== 'id' && !colors.some((c) => x.startsWith(c)))
      .sort((a, _b) => (/color[0-9]+/.test(a) ? 1 : -1))
  }

  getThemeVals() {
    const keys = this.themeKeysWithoutSpecificColors

    const result = Object.fromEntries(
      keys.map((name) => {
        const value = this.theme[name]

        // these are imprecise so hacking around for now...
        const offset = this.themeColorScale?.colors.findIndex((c) => {
          if (c.originalValue === value) return true
          const hexColor = toHex(value)
          const color = hexToColor(hexColor)
          return (
            c.hue === color.hue &&
            c.lightness === color.lightness &&
            c.saturation === color.saturation
          )
        })

        const color = hexToColor(toHex(value))

        const val: ThemeVal = {
          name,
          value,
          pseudo: pseudoKeys.find((x) => name.endsWith(x)) || 'Base',
          offset: offset ?? null,
          color,
        }

        return [name, val] as [string, ThemeVal]
      })
    )
    return result
  }

  get themeVals() {
    return this.getThemeVals()
  }

  getThemePalette(themeId: string) {
    const name = this.getThemePaletteName(themeId)
    if (name) {
      return colorsStore.getScale(name)
    }
  }

  get themeColor() {
    return this.getThemePaletteName(this.themeId)
  }

  get themeColorScale() {
    if (!this.themeColor) {
      return null
    }
    return colorsStore.getScale(this.themeColor)
  }

  get themePaletteHex() {
    return this.themeColorScale?.colors.map((color) => {
      return colorToHex(color)
    })
  }

  get themesWithCategory(): Record<string, ThemeWithCategory> {
    return Object.fromEntries([
      ...Object.entries(this.themes).map(([name, theme]) => {
        const splitName = name.split('_')
        const [category, categoryID = ''] =
          name === 'dark' || name === 'light'
            ? (['scheme', name] as const)
            : isComponentTheme(name)
              ? (['component', last(splitName)] as const)
              : ([`Level ${splitName.length}`, last(splitName)] as const)

        const themeWithCategory: ThemeWithCategory = {
          theme,
          id: name,
          category,
          categoryID,
          level: splitName.length,
        }

        return [name, themeWithCategory]
      }),
    ])
  }

  get themesList() {
    return Object.entries(this.themesWithCategory).map(([_, v]) => v)
  }

  get uniqueThemeIDsByCategory() {
    const categories: Record<ThemeCategory, Set<string>> = {}
    for (const { category, categoryID } of this.themesList) {
      categories[category] ??= new Set()
      categories[category].add(categoryID)
    }
    return Object.fromEntries(
      Object.entries(categories).sort(([a], [b]) =>
        a == 'scheme' || b === 'component'
          ? -2
          : a == 'component'
            ? 1
            : b === 'scheme'
              ? 1
              : a.localeCompare(b)
      )
    )
  }

  themeCombos({
    prefix = '',
    includeComponentThemes,
  }: {
    prefix?: string
    includeComponentThemes?: boolean
  } = {}) {
    if (includeComponentThemes) {
      return this.themesList
    }

    return this.themesList.filter((x) => x.category !== 'component' && x.id.startsWith(prefix))
    // return getUniqueThemeCombos(this.themesList()).filter((x) => x.startsWith(prefix))
  }

  get pseudo(): PseudoKeys | 'Base' {
    return pseudoKeys[this.column - 1] ?? 'Base'
  }

  get focusedThemeVal() {
    return this.themeVals[this.focusedKey]
  }

  get isComponentTheme() {
    return this.componentName !== 'none'
  }

  get baseThemeVals() {
    return Object.fromEntries(
      Object.entries(this.themeVals).filter(([k]) => !pseudoKeys.some((key) => k.endsWith(key)))
    )
  }

  static getValuesByPsuedo(themeValues: Record<string, ThemeVal>, pseudo: PseudoKeys) {
    const filtered = Object.entries(themeValues).flatMap(([k, v]) => {
      if (k.endsWith(pseudo)) {
        return [[k, v]]
      }
      return []
    }) as any as [string, ThemeVal][]

    return Object.fromEntries(filtered)
  }

  get themeValuesByPseudo() {
    return {
      base: this.baseThemeVals,
      hover: ThemesStore.getValuesByPsuedo(this.themeVals, 'Hover'),
      focus: ThemesStore.getValuesByPsuedo(this.themeVals, 'Focus'),
      press: ThemesStore.getValuesByPsuedo(this.themeVals, 'Press'),
    }
  }

  get focusedThemeValues() {
    return this.themeValuesByPseudo[this.pseudo.toLowerCase()]
  }

  get componentName() {
    const n = last(this.themeId.split('_'))
    if (!n) {
      return 'none'
    }
    return n[0].toUpperCase() === n[0] ? n : ''
  }

  get componentNames() {
    return [
      ...new Set(
        Object.keys(this.themes)
          .map((name) => name.split('_'))
          .map((names) => names[names.length - 1])
          .filter((lastName) => /^[A-Z]/.test(lastName))
      ),
    ]
  }

  updateCurrent(themeValue: ThemeVal, by: number) {
    if (typeof themeValue.offset !== 'number') {
      return
    }

    const nextIndex = themeValue.offset + by
    const next = this.themeColorScale?.colors[nextIndex]

    if (next) {
      const hex = colorToHex(next)
      const updateFields = {
        [themeValue.name]: hex,
      }

      updateTheme({
        name: this.themeId,
        theme: updateFields,
      })

      const nextTheme = {
        ...this.theme,
        ...updateFields,
      }

      this.themes = {
        ...this.themes,
        [this.themeId]: nextTheme,
      }
    }
  }

  get parentThemeId() {
    return this.themeId.split('_').reverse().slice(1).reverse().join('_')
  }

  // make sure to route all theme updates through here
  setTheme(themeId: string) {
    const paletteName = this.getThemePaletteName(themeId)
    if (paletteName) {
      colorsStore.setPalette(paletteName)
    }
    this.themeId = themeId
  }

  getThemeInfo(themeId: string) {
    const loadedThemeInfo = rootStore.themes?.themes?.[themeId]
    const scheme = colorsStore.scheme
    return Array.isArray(loadedThemeInfo)
      ? loadedThemeInfo.find((i) => i.parent === scheme)
      : loadedThemeInfo
  }

  getThemePaletteName(themeId: string) {
    // find the theme palette
    const themeInfo = this.getThemeInfo(themeId)
    if (themeInfo) {
      const scheme = colorsStore.scheme
      if ('palette' in themeInfo) {
        let paletteName = `${themeInfo.palette}`
        if (!paletteName.startsWith(scheme)) {
          paletteName = `${scheme}_${paletteName}`
        }
        return paletteName
      }
      if ('mask' in themeInfo) {
        // get parent:
        const parent = themeId.split('_').slice(0, -1).join('_')
        if (parent in this.themes) {
          return this.getThemePaletteName(parent)
        }
      }
    }
  }

  setIsPinned(val: boolean) {
    this.isPinned = val
    if (!val) {
      this.isFocusingSingle = false
    }
  }

  setFocusedThemeItem({
    row,
    column,
    name,
    shouldPin,
  }: {
    row: number
    column: number
    name: string
    shouldPin?: boolean
  }) {
    if (this.themes.isPinned && !shouldPin) {
      return
    }
    // toggle off
    if (this.isPinned && this.themeId.endsWith(name)) {
      if (this.parentThemeId) {
        this.setTheme(this.parentThemeId)
      }
      this.isPinned = false
      return
    }
    this.row = row
    this.column = column
    if (name) {
      const nextName = name in this.themes ? name : removeComponentName(this.themeId) + `_${name}`
      this.setTheme(nextName)
    }
    if (shouldPin) {
      this.isPinned = !this.isPinned
    }
  }

  setHoveredThemeItem({ row, column }: { row: number; column: number }) {
    if (this.isPinned) {
      return
    }
    this.row = row
    this.column = column
  }

  get currentCombosForFirstPart() {
    return this.themeCombos({
      prefix: this.themeId,
    })
  }

  get currentCombos() {
    return this.themeCombos({
      includeComponentThemes: true,
    })
  }

  themeIdPreview = ''

  togglePreviewThemeItem({ id }: { id: string }) {
    this.themeIdPreview = this.themeIdPreview === id ? '' : id
  }

  toggleFocusedThemeItem({ id }: { id: string }) {
    if (this.themeId) {
      if (id === 'dark' || id == 'light') {
        this.setTheme(this.themeId.replace(id === 'dark' ? 'light' : 'dark', id))
        return
      }
    }

    const { themeId } = this
    const isActive = this.themeId.includes(id)

    if (themeId.includes('_') && isActive) {
      this.setTheme(
        themeId
          .split('_')
          .filter((x) => x !== id)
          .join('_')
      )
    } else {
      const parts = themeId.split('_')

      for (let i = parts.length; i >= 0; i--) {
        const prefix = parts.slice(0, i).join('_')
        const joined = `${prefix}_${id}`
        if (this.currentCombos.some((x) => x.id === joined)) {
          this.setTheme(joined)
          return
        }
      }

      this.setTheme(id || '')
    }
  }
}

export const themesStore = createStore(ThemesStore)
