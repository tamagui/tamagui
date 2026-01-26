import {
  type BuildPalette,
  createPalettes,
  getThemeSuitePalettes,
  type TemplateStrategy,
  type ThemeSuiteItem,
} from '@tamagui/theme-builder'
import { createStore, createUseStore } from '@tamagui/use-store'
import { toastController } from '~/features/studio/ToastProvider'
import { demoOptions, optionValues } from '~/features/studio/theme/demoOptions'
import { getRandomElement } from '~/features/studio/theme/helpers/getRandomElement'
import { steps } from '~/features/studio/theme/steps/steps'
import type { SectionStep, ThemeStudioSection } from '~/features/studio/theme/types'
import { generateThemeBuilderCode } from '../../api'
import { defaultThemeSuiteItem } from '../defaultThemeSuiteItem'
import type { BuildTheme, ThemeBuilderState, ThemeSuiteItemData } from '../types'
import { updatePreviewTheme } from '../updatePreviewTheme'

type AccentSetting = 'color' | 'inverse' | 'off'

export class ThemeBuilderStore {
  loaded = false
  state: ThemeBuilderState | null = null
  themeSuiteVersion = 0
  themeSuiteId = 'base'
  listeners = new Set<Function>()

  get themeSuiteUID() {
    return `${this.themeSuiteId}`
  }

  // "working state" => directly derived from this.themeSuite values
  // never mutate `this.state`, instead mutate these and then `this.save` to persist it
  // we should improve this to be less verbose/brittle, reasons for it now:
  //   1. use-store is tracks non-deeply, reduces renders
  //   2. gives us a basic working data / undo / save functionality
  name = defaultThemeSuiteItem.name
  palettes: Record<string, BuildPalette> = defaultThemeSuiteItem.palettes
  schemes = defaultThemeSuiteItem.schemes
  accentSetting: AccentSetting = 'color'
  templateStrategy: TemplateStrategy = 'base'

  // Sub-themes related properties
  subThemes: BuildTheme[] = []
  selectedSubTheme: string | null = null
  showAddThemeMenu = false
  baseTheme: BuildTheme = {
    id: 'base',
    name: 'base',
    type: 'theme',
    template: 'base',
    palette: 'base',
  }

  // Component themes related properties
  componentThemes: BuildTheme[] = []
  selectedComponentTheme: string | null = null
  componentParentTheme: string | null = null

  private async sync(state: ThemeBuilderState) {
    if (!this.themeSuiteId) {
      console.warn(`Can't sync without themeSuiteId`)
      return
    }
    this.state = state
    const themeSuite = state.themeSuites[this.themeSuiteId]
    if (themeSuite) {
      await this.updateCurrentThemeSuite(themeSuite)
    }
  }

  // using up to date data from unsaved state
  get themeSuite(): ThemeSuiteItem | undefined {
    if (!this.state) {
      return {
        ...this.getWorkingThemeSuite(),
        id: this.themeSuiteId || '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        name: '',
      }
    }

    return this.state && this.themeSuiteId
      ? {
          ...this.state.themeSuites[this.themeSuiteId],
          ...this.getWorkingThemeSuite(),
        }
      : undefined
  }

  private async updateCurrentThemeSuite(next: Partial<ThemeSuiteItem>) {
    if (!this.themeSuite) {
      throw new Error(`No data`)
    }
    const row = {
      ...this.themeSuite,
      ...next,
    }
    if (
      this.themeSuiteVersion > 1 &&
      JSON.stringify(row) === JSON.stringify(this.themeSuite)
    ) {
      // avoid update if it can
      return
    }
    // sync to working data:
    for (const key in row) {
      if (key in defaultThemeSuiteItem) {
        this[key] = row[key] || defaultThemeSuiteItem[key]
      }
    }
    this.updateDisabledState()
    this.themeSuiteVersion++
    await this.refreshThemeSuite()
  }

  async reset() {
    this.name = defaultThemeSuiteItem.name
    this.palettes = defaultThemeSuiteItem.palettes
    this.schemes = defaultThemeSuiteItem.schemes
    this.accentSetting = 'color'
    this.templateStrategy = 'base'
    await this.refreshThemeSuite()
  }

  // state:
  step = 0
  direction = 0
  steps: ThemeStudioSection[] = steps
  // @persist
  showExplanationSteps = true
  hasUnsavedChanges = false
  demosOptions = demoOptions
  themeSwitchOpen = true

  currentQuery = ''
  currentThemeId = ''

  async setAccentSetting(next: AccentSetting) {
    this.accentSetting = next
    await this.refreshThemeSuite()
  }

  async load(themeId?: string) {
    if (themeId) {
      try {
        const res = await fetch(`/api/theme/histories?id=${themeId}`)
        const data = await res.json()

        if (data?.theme_data) {
          this.currentThemeId = themeId
          this.currentQuery = data.search_query
          await this.updateGenerate(data.theme_data, data.search_query, themeId)
        }
      } catch (err) {
        console.error('Failed to load theme:', err)
      }
    }
    await this.refreshThemeSuite()
  }

  // most recent first
  history: ThemeBuilderState[] = []
  redoHistory: ThemeBuilderState[] = []

  undo() {
    const [last] = this.history
    if (last) {
      this.redoHistory.unshift(structuredClone(this.state!))
      this.sync(last)
      this.history = this.history.slice(1)
    } else {
      toastController(`No more history items`)
    }
  }

  redo() {
    const [last] = this.redoHistory
    if (last) {
      this.history.unshift(last)
      this.sync(last)
      this.redoHistory = this.redoHistory.slice(1)
    } else {
      toastController(`No more history items`)
    }
  }

  getWorkingThemeSuite() {
    return {
      name: this.name,
      palettes: this.palettes,
      schemes: this.schemes,
      templateStrategy: this.templateStrategy,
    } satisfies ThemeSuiteItemData
  }

  async updateGenerate(
    themeSuite: ThemeSuiteItemData,
    query?: string,
    themeId?: string | number,
    username?: string | null
  ) {
    this.palettes = themeSuite.palettes
    this.themeSuiteVersion++

    if (query && themeId) {
      this.currentQuery = query
      this.currentThemeId = String(themeId)
    }

    this.themeSuiteId = `${this.themeSuiteId}${this.themeSuiteVersion}`
    await this.refreshThemeSuite()
  }

  getPalettesForTheme(theme: BuildTheme, palettes = this.palettes) {
    const palette =
      palettes[theme.palette || 'base'] ||
      this.palettes[theme.palette] ||
      this.palettes.base
    if (!palette) {
      console.warn(
        `No palette found: ${theme.palette} (${Object.keys(this.palettes).join(', ')})`
      )
      return {
        light: [] as string[],
        dark: [] as string[],
      }
    }
    return getThemeSuitePalettes(palette)
  }

  async setSelectedScheme(scheme: 'dark' | 'light', val: boolean) {
    this.schemes = {
      ...this.schemes,
      [scheme]: val,
    }
    await this.save()
  }

  async refreshThemeSuite() {
    const palettes = { ...this.palettes }

    if (this.accentSetting === 'off') {
      delete palettes['accent']
    }

    if (this.accentSetting === 'inverse') {
      palettes['accent'] = {
        name: 'accent',
        anchors: palettes.base.anchors.map((anchor) => {
          return {
            ...anchor,
            hue: {
              ...anchor.hue,
              dark: anchor.hue.light,
              light: anchor.hue.dark,
            },
            sat: {
              ...anchor.sat,
              dark: anchor.sat.light,
              light: anchor.sat.dark,
            },
            lum: {
              ...anchor.lum,
              dark: anchor.lum.light,
              light: anchor.lum.dark,
            },
          }
        }),
      }
    }

    if (
      await updatePreviewTheme({
        id: this.themeSuiteUID,
        palettes,
        schemes: this.schemes,
        templateStrategy: this.templateStrategy,
      })
    ) {
      // this.themeSuiteId = `${Math.round(Math.random() * 100_000)}`
      this.themeSuiteVersion++
      this.save()
    }
  }

  randomizeId = 0
  randomizeDemoOptions() {
    this.randomizeId = Math.random()
    this.demosOptions = {
      inverseAccent: this.demosOptions.inverseAccent,
      borderRadius: getRandomElement(optionValues.borderRadius),
      borderWidth: getRandomElement(optionValues.borderWidth),
      headingFontFamily: getRandomElement(optionValues.headingFontFamily),
      fillStyle: getRandomElement(optionValues.fillStyle),
      elevation: getRandomElement(optionValues.elevation),
      spacing: getRandomElement(optionValues.spacing),
      textAccent: getRandomElement(optionValues.textAccent),
      backgroundAccent: getRandomElement(optionValues.backgroundAccent),
    }
  }

  async save() {
    this.listeners.forEach((cb) => {
      cb()
    })
  }

  async updatePalette(name: string, palette: Partial<BuildPalette>) {
    this.palettes = {
      ...this.palettes,
      [name]: {
        ...this.palettes[name],
        ...palette,
      },
    }
    await this.refreshThemeSuite()
  }

  setSelectedSubTheme(id: string) {
    this.selectedSubTheme = id
  }

  addSubTheme(theme: BuildTheme) {
    this.subThemes = [...this.subThemes, theme]
    if (!this.selectedSubTheme) {
      this.selectedSubTheme = theme.id
    }
  }

  updateSubTheme(theme: BuildTheme) {
    this.subThemes = this.subThemes.map((t) => (t.id === theme.id ? theme : t))
  }

  deleteSubTheme(theme: BuildTheme) {
    this.subThemes = this.subThemes.filter((t) => t.id !== theme.id)
    if (this.selectedSubTheme === theme.id) {
      this.selectedSubTheme = this.subThemes[0]?.id || null
    }
  }

  addPalette(palette: BuildPalette) {
    this.palettes = {
      ...this.palettes,
      [palette.name]: palette,
    }
  }

  setSelectedComponentTheme(id: string) {
    this.selectedComponentTheme = id
  }

  get sectionsFlat() {
    return this.steps.flatMap((section, sectionIdx) => {
      // @ts-ignore
      return section.steps
        .map((step: SectionStep) => {
          return {
            sectionIdx,
            title: section.title,
            id: section.id,
            ...step,
          }
        })
        .filter((x) => (!this.showExplanationSteps && x.explanation ? false : true))
    })
  }

  get currentSection() {
    return this.sectionsFlat[this.step]
  }

  get themeSwitchTip() {
    return this.currentSection?.themeSwitchTip
  }

  get sectionIndex() {
    const sectionId = this.sectionsFlat.find((s) => s?.id === this.currentSection.id)?.id
    const index = this.steps.findIndex((section) => {
      return section.id === sectionId
    })
    return index
  }

  get sectionTitles() {
    return [...new Set(this.sectionsFlat.map((x) => x.title))]
  }

  get isCentered() {
    return !this.currentSection || !this.currentSection.showInline
  }

  get canGoBackward() {
    return this.step - 1 >= 0
  }

  get canGoForward() {
    return this.step + 1 < this.sectionsFlat.length
  }

  // to disable a step from going forward, add disableForward to its store and set it to true
  get disableForward() {
    return this.stepsDisabledState[this.step]
  }

  updateDisabledState() {
    this.stepsDisabledState = this.sectionsFlat.map(({ id, saveOnNext }, idx) => {
      return !!this?.disableForward && !!saveOnNext
    })
  }

  stepsDisabledState: boolean[] = []

  forward() {
    this.setStep(this.step + 1)
  }

  backward() {
    this.setStep(this.step - 1)
  }

  setStep(next: number) {
    if (next === this.step) {
      return
    }
    const dir = next > this.step ? 1 : -1
    if (dir === 1) {
      if (
        !this.canGoForward ||
        this.stepsDisabledState.slice(this.step, next).filter(Boolean).length > 0
      ) {
        console.warn(`Can't go forward`)
        return
      }

      if (this.sectionsFlat[this.step].saveOnNext) {
        this.save()
      }
    } else if (dir === -1) {
      if (!this.canGoBackward) {
        console.warn(`Can't go backward`)
        return
      }
    }

    this.direction = dir
    this.step = next

    setTimeout(() => this.updateDisabledState(), 1)
  }

  get palettesBuilt() {
    return createPalettes(this.palettes)
  }

  async getCode(
    {
      includeComponentThemes = false,
      includeSizeTokens = false,
    }: { includeComponentThemes: boolean; includeSizeTokens: boolean } = {
      includeComponentThemes: false,
      includeSizeTokens: false,
    }
  ) {
    return await generateThemeBuilderCode({
      ...this.getWorkingThemeSuite(),
      includeComponentThemes,
      includeSizeTokens,
    })
  }
}

export const themeBuilderStore = createStore(ThemeBuilderStore)

export const useThemeBuilderStore = createUseStore(ThemeBuilderStore)

globalThis['themeBuilderStore'] = themeBuilderStore

// for syncing

export type UpdateGenerateArgs = Parameters<typeof themeBuilderStore.updateGenerate>
