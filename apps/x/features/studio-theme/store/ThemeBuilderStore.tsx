import type { Template, ThemeDefinitions } from '@tamagui/theme-builder'
import { createStore, createUseStore } from '@tamagui/use-store'

import { toastController } from '../../../studio/ToastProvider'
import type { SectionStep, ThemeStudioSection } from '../../../types'
import { callStudioProcedure } from '../callApi'
import { defaultThemeSuiteItem } from '../defaultThemeSuiteItem'
import { demoOptions, optionValues } from '../demoOptions'
import { getFinalPalettes } from '../getFinalPalettes'
import { getRandomElement } from '../../../helpers/getRandomElement'
import { getThemeSuitePalettes } from '../getThemeSuitePalettes'
import { getUniqueId } from '../../../helpers/getUniqueId'
import { updatePreviewTheme } from '../previewTheme'
import type {
  BuildMask,
  BuildPalette,
  BuildSubTheme,
  BuildTemplates,
  BuildTheme,
  BuildThemeMask,
  ThemeBuilderState,
  ThemeSuiteItem,
  ThemeSuiteItemData,
} from '../types'

export class ThemeBuilderStore {
  loaded = false
  state: ThemeBuilderState | null = null
  themeSuiteVersion = 0
  themeSuiteId: string | undefined

  // using up to date data from unsaved state
  get themeSuite(): ThemeSuiteItem | undefined {
    return this.state && this.themeSuiteId
      ? {
          ...this.state.themeSuites[this.themeSuiteId],
          ...this.getWorkingThemeSuite(),
        }
      : undefined
  }

  // sorted, using up to date data from unsaved state
  get themeSuites() {
    if (!this.state) {
      throw new Error(`No state`)
    }
    if (!this.state.themeSuites) {
      console.warn(`No theme suites?`)
      return []
    }
    return Object.values(this.state.themeSuites)
      .toSorted((a, b) => {
        return a.updatedAt > b.updatedAt ? -1 : 1
      })
      .map((x) => {
        if (x.id === this.themeSuiteId && this.themeSuite) {
          return this.themeSuite
        }
        return x
      })
  }

  // "working state" => directly derived from this.themeSuite values
  // never mutate `this.state`, instead mutate these and then `this.save` to persist it
  // we should improve this to be less verbose/brittle, reasons for it now:
  //   1. use-store is tracks non-deeply, reduces renders
  //   2. gives us a basic working data / undo / save functionality
  name = defaultThemeSuiteItem.name
  baseTheme: BuildTheme = defaultThemeSuiteItem.baseTheme
  subThemes: BuildSubTheme[] = defaultThemeSuiteItem.subThemes
  componentThemes: ThemeDefinitions = defaultThemeSuiteItem.componentThemes
  palettes: Record<string, BuildPalette> = defaultThemeSuiteItem.palettes
  templates: BuildTemplates = defaultThemeSuiteItem.templates
  selectedSchemes = defaultThemeSuiteItem.selectedSchemes

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

  // state:
  selectedSubTheme: string | null = null
  componentParentTheme: 'base' | 'accent' = 'base'
  selectedComponentTheme: string | null = null
  step = 0
  direction = 0
  steps: ThemeStudioSection[] = []
  // @persist
  showExplanationSteps = true
  hasUnsavedChanges = false
  showCurrentTheme = false
  showAddThemeMenu = false
  showTemplate = false
  demosOptions = demoOptions
  themeSwitchOpen = true

  async load() {
    if (this.loaded) return
    const data = await getPersistedState()
    if (data) {
      this.state = data
    } else {
      this.state = {
        themeSuites: {},
      }
    }

    if (!this.state) throw new Error(`impossible`)

    // validation / migration can be here
    if (!this.state.themeSuites) {
      // old style, needs to migrate...
      this.state.themeSuites = {}
    }

    for (const key in this.state.themeSuites) {
      const themeSuite = this.state.themeSuites[key]
      if (themeSuite.id !== key) {
        // fix id:
        themeSuite.id = key
      }
    }

    // sync
    this.sync(this.state)

    const themeSuite = this.state.themeSuites[this.themeSuiteId || '']
    if (themeSuite) {
      await this.updateCurrentThemeSuite(themeSuite)
    }
    this.loaded = true
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
      toastController.show(`No more history items`)
    }
  }

  redo() {
    const [last] = this.redoHistory
    if (last) {
      this.history.unshift(last)
      this.sync(last)
      this.redoHistory = this.redoHistory.slice(1)
    } else {
      toastController.show(`No more history items`)
    }
  }

  getWorkingThemeSuite(): ThemeSuiteItemData {
    return {
      name: this.name,
      palettes: this.palettes,
      templates: this.templates,
      baseTheme: this.baseTheme,
      subThemes: this.subThemes,
      componentThemes: this.componentThemes,
      selectedSchemes: this.selectedSchemes,
    }
  }

  async save() {
    if (!this.state) return

    if (this.themeSuiteId) {
      const themeSuite = this.state.themeSuites[this.themeSuiteId]
      if (themeSuite) {
        Object.assign(themeSuite, this.getWorkingThemeSuite())
      }
    }

    this.history = (() => {
      let _ = [...this.history]
      _.unshift(structuredClone(this.state))
      if (_.length > 110) {
        _ = _.slice(0, 100)
      }
      return _
    })()

    await persistState(this.state)
  }

  get subTheme() {
    const val = this.subThemes.find((x) => x.id === this.selectedSubTheme)
    return val
  }

  async setThemeSuiteId(themeSuiteId: string) {
    this.themeSuiteId = themeSuiteId
    if (!this.state) {
      console.warn(`no data`)
      return
    }
    let row = this.state.themeSuites[themeSuiteId]
    const wasMissing = !row
    if (!row) {
      row = {
        ...defaultThemeSuiteItem,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        id: themeSuiteId,
      }
      this.state.themeSuites[themeSuiteId] = row
    }
    await this.updateCurrentThemeSuite(row)
    if (wasMissing) {
      this.save()
    }
    this.sync(this.state)
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

  async addThemeSuite(next: Omit<ThemeSuiteItem, 'id' | 'createdAt' | 'updatedAt'>) {
    const themes = this.state?.themeSuites
    if (!themes) throw new Error(`No themes`)
    const id = getUniqueId()
    const themeSuite = {
      ...next,
      id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    console.info('adding', themeSuite)
    this.state = {
      ...this.state,
      themeSuites: {
        ...themes,
        [id]: themeSuite,
      },
    }
    this.save()
  }

  deleteTheme(id: string) {
    const toDeleteId = this.themeSuites.find((x) => x.id === id)?.id
    if (!toDeleteId) {
      throw new Error(`No theme ${id}`)
    }
    const next = {
      ...this.state!.themeSuites,
    }
    delete next[toDeleteId]
    this.state = {
      ...this.state,
      themeSuites: next,
    }
  }

  async updateTheme(next: { id: string } & Partial<BuildTheme>) {
    if (next.id === this.baseTheme.id) {
      await this.updateBaseTheme(next)
    } else if (next.id === this.baseTheme.accent?.id) {
      await this.updateBaseTheme({
        accent: {
          ...this.baseTheme.accent,
          ...next,
        },
      })
    } else {
      const { subThemes } = this
      const theme = subThemes.find((x) => x.id === next.id)
      if (theme) {
        this.subThemes = subThemes.map((t) => {
          if (t.id === next.id) {
            if (t.type === 'theme') {
              return {
                ...t,
                ...next,
              }
            }
          }
          return t
        })
        await this.save()
      }
      console.warn(`Not implemented`)
    }
  }

  async updateThemeSuite(update: { id: string } & Partial<ThemeSuiteItem>) {
    const themeSuites = this.state?.themeSuites
    if (!themeSuites) throw new Error(`No themes`)
    const next = {
      ...themeSuites[update.id],
      ...update,
      updatedAt: Date.now(),
    }
    this.state = {
      ...this.state,
      themeSuites: {
        ...themeSuites,
        [next.id]: next,
      },
    }
    if (next.id === this.themeSuiteId) {
      await this.updateCurrentThemeSuite(next)
    }
    await this.save()
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

  async updateSubTheme(next: { id: string } & Partial<BuildSubTheme>) {
    await this.updateCurrentThemeSuite({
      subThemes: this.subThemes.map((s) =>
        s.id === next.id
          ? {
              ...s,
              ...(next as any),
            }
          : s
      ),
    })
    await this.save()
  }

  async updateBaseTheme(next: Partial<BuildTheme>) {
    await this.updateCurrentThemeSuite({
      baseTheme: {
        ...this.baseTheme,
        ...next,
      },
    })
    await this.save()
  }

  setSteps(steps: ThemeStudioSection[]) {
    this.steps = steps
    this.setStep(this.step)
  }

  async setSelectedScheme(scheme: 'dark' | 'light', val: boolean) {
    this.selectedSchemes = {
      ...this.selectedSchemes,
      [scheme]: val,
    }
    await this.save()
  }

  async refreshThemeSuite() {
    if (
      await updatePreviewTheme({
        id: this.baseTheme.id,
        ...this.getWorkingThemeSuite(),
      })
    ) {
      this.themeSuiteVersion++
    }
  }

  randomizeDemoOptions() {
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

  async addSubTheme(theme: Omit<BuildTheme, 'id'> | Omit<BuildThemeMask, 'id'>) {
    const id = getUniqueId()

    // logic to prevent adding duplicate theme names
    // tries to add numbers to avoid duplication
    // e.g. warning -> warning-1 -> warning-2
    const duplicateTheme = this.subThemes.find((_theme) => _theme.name === theme.name)
    if (duplicateTheme) {
      const duplicateNumberSuffix = Number(duplicateTheme.name.split('-').pop())
      let newName = `${theme.name}-1`
      if (!isNaN(duplicateNumberSuffix)) {
        let intendedName = (function () {
          const split = duplicateTheme.name.split('-')
          split.pop()
          return split.join('-')
        })()
        newName = `${intendedName}-${duplicateNumberSuffix + 1}`
      }
      this.addSubTheme({ ...theme, name: newName })
      return
    }

    const next = [
      {
        ...theme,
        id,
      },
      ...this.subThemes,
    ]
    this.subThemes = next
    this.selectedSubTheme = id
    await this.save()
    await this.refreshThemeSuite()
  }

  addTemplate(
    template: Template,
    name = `template-${Object.keys(this.templates).length}`
  ) {
    this.templates = {
      ...this.templates,
      [name]: template,
    }
    void this.save()
    return name
  }

  async updateTemplate(name: string, template: Partial<Template>) {
    this.templates = {
      ...this.templates,
      [name]: {
        ...this.templates[name],
        ...(template as any),
      },
    }
    await this.refreshThemeSuite()
    await this.save()
  }

  async setSelectedSubTheme(id: string | null) {
    this.selectedSubTheme = id
    await this.refreshThemeSuite()
  }

  async setSelectedComponentTheme(id: string | null) {
    this.selectedComponentTheme = id
    await this.refreshThemeSuite()
  }

  async deleteSubTheme(theme: BuildSubTheme) {
    this.subThemes = this.subThemes.filter((x) => x !== theme)
    this.setSelectedSubTheme(null)
    await this.save()
  }

  async addPalette(palette: BuildPalette) {
    if (Object.values(this.palettes).some((_) => _.name === palette.name)) {
      palette.name = `${palette.name.replace(/-[0-9]+$/, '')}-1`
    }
    this.palettes = {
      ...this.palettes,
      [palette.name]: palette,
    }
    await this.save()
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
    await this.save()
  }

  async deletePalette(name: string) {
    this.palettes = (() => {
      let next = structuredClone(this.palettes)
      delete next[name]
      return next
    })()
    await this.refreshThemeSuite()
    await this.save()
  }

  async addMask(themeId: string, mask: Omit<BuildMask, 'id'>) {
    const theme = this.subThemes.find((theme) => theme.id === themeId)
    if (theme?.type !== 'mask') {
      console.error('Theme not found')
      return
    }
    await this.updateSubTheme({
      id: themeId,
      masks: [...(theme?.masks ?? []), { ...mask, id: getUniqueId() } as BuildMask],
    })
  }

  async updateMask(themeId: string, maskId: string, mask: Partial<BuildMask>) {
    const theme = this.subThemes.find((theme) => theme.id === themeId)
    if (theme?.type !== 'mask') {
      console.error('Theme not found')
      return
    }
    await this.updateSubTheme({
      id: themeId,
      masks: theme.masks.map((_mask) => {
        if (maskId !== _mask.id) return _mask
        return { ..._mask, ...mask } as BuildMask
      }),
    })
  }

  async removeMask(themeId: string, maskId: string) {
    const theme = this.subThemes.find((theme) => theme.id === themeId)
    if (theme?.type !== 'mask') {
      console.error('Theme not found')
      return
    }
    await this.updateSubTheme({
      id: themeId,
      masks: theme.masks.filter((mask) => mask.id !== maskId) || [],
    })
  }

  async deleteAccent() {
    await this.updateBaseTheme({
      accent: undefined,
    })
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

  hasSetStepOnce = false

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
    this.hasSetStepOnce = true

    setTimeout(() => this.updateDisabledState(), 1)
  }

  get palettesBuilt() {
    return getFinalPalettes(this.palettes)
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
    return await callStudioProcedure('generateThemeBuilderCode', {
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

const loadUrl = `${
  process.env.NODE_ENV === 'production' ? 'https://tamagui.dev' : 'http://localhost:5005'
}/api/studio/load`

const saveUrl = `${
  process.env.NODE_ENV === 'production' ? 'https://tamagui.dev' : 'http://localhost:5005'
}/api/studio/save`

const version = '1'
const localKey = `tamagui-theme-suites-${version}`

const getPersistedState = async () => {
  try {
    return await fetch(loadUrl, {
      credentials: 'include',
    }).then((res) => res.json() as unknown as ThemeBuilderState)
  } catch (err) {
    const fallback = JSON.parse(
      localStorage.getItem(localKey) || 'null'
    ) as ThemeBuilderState
    console.warn(`Error loading, fallback to localStorage`, loadUrl)
    console.info(`[load]`, fallback)
    return fallback
  }
}

const persistState = async (state: ThemeBuilderState) => {
  console.info('[persist]', saveUrl, state)
  localStorage.setItem(localKey, JSON.stringify(state))
  return await fetch(saveUrl, {
    method: 'POST',
    body: JSON.stringify(state),
    credentials: 'include',
  }).then(() => {})
}
