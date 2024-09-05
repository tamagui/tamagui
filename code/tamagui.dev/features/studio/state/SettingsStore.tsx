import { createStore } from '@tamagui/use-store'
import type { TamaguiInternalConfig } from 'tamagui'
import { rootStore } from './RootStore'

type ObjectField = {
  type: 'object'
  name: string
  fields: FormField[]
}

type BooleanField = {
  type: 'boolean'
  name: string
}

type TextField = {
  type: 'text'
  name: string
}

type NumberField = {
  type: 'number'
  name: string
}
type FormField = ObjectField | BooleanField | TextField | NumberField

export class SettingsStore {
  hasChanges = false
  formFields: FormField = { type: 'object', fields: [], name: 'root' }
  draft: Pick<
    TamaguiInternalConfig,
    | 'cssStyleSeparator'
    | 'disableSSR'
    | 'mediaQueryDefaultActive'
    | 'disableRootThemeClass'
    | 'onlyAllowShorthands'
    | 'themeClassNameOnRoot'
    | 'maxDarkLightNesting'
    | 'shouldAddPrefersColorThemes'
  > = null as any

  syncDraft() {
    if (!rootStore.config) throw new Error('Config not loaded.')
    this.hasChanges = false

    let mediaQueryDefaultActiveMap = new Map<string, boolean>()
    for (const mediaKey of Object.keys(rootStore.config?.media)) {
      mediaQueryDefaultActiveMap.set(
        mediaKey,
        rootStore.config.mediaQueryDefaultActive?.[mediaKey] ?? false
      )
    }
    this.formFields = {
      name: 'root',
      type: 'object',
      fields: [
        {
          name: 'cssStyleSeparator',
          type: 'text',
        },
        {
          name: 'disableSSR',
          type: 'boolean',
        },
        {
          name: 'mediaQueryDefaultActive',
          type: 'object',
          fields: Object.entries(Object.fromEntries(mediaQueryDefaultActiveMap)).map(
            ([key, value]) => ({
              name: key,
              type: 'boolean',
            })
          ),
        },
        {
          name: 'disableRootThemeClass',
          type: 'boolean',
        },
        {
          name: 'onlyAllowShorthands',
          type: 'boolean',
        },
        {
          name: 'themeClassNameOnRoot',
          type: 'boolean',
        },
        {
          name: 'maxDarkLightNesting',
          type: 'number',
        },
        {
          name: 'shouldAddPrefersColorThemes',
          type: 'boolean',
        },
      ],
    }

    this.draft = {
      onlyAllowShorthands: rootStore.config.onlyAllowShorthands,
      cssStyleSeparator: rootStore.config.cssStyleSeparator,
      disableRootThemeClass: rootStore.config.disableRootThemeClass,
      disableSSR: rootStore.config.disableSSR,
      maxDarkLightNesting: rootStore.config.maxDarkLightNesting,
      mediaQueryDefaultActive: Object.fromEntries(mediaQueryDefaultActiveMap) as any,
      shouldAddPrefersColorThemes: rootStore.config.shouldAddPrefersColorThemes,
      themeClassNameOnRoot: rootStore.config.themeClassNameOnRoot,
    }
  }

  updateValue(name: string, value: any, parent?: string) {
    if (!this.draft) return
    this.hasChanges = true

    if (parent) {
      this.draft = {
        ...this.draft,
        [parent]: { ...this.draft[parent], [name]: value },
      }
    } else {
      this.draft = { ...this.draft, [name]: value }
    }
  }
}

export const settingsStore = createStore(SettingsStore)
