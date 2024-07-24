import type { ThemeDefinition } from '@tamagui/theme-builder'
import { createStore } from '@tamagui/use-store'
import type { TamaguiInternalConfig, ThemeName } from 'tamagui'
import { isLocal } from '~/features/studio/constants'
// import { watchTamaguiDirectory } from '../helpers/watchTamaguiDirectory'
import { toastController } from '../ToastProvider'
import type { Components, DialogTypes, StudioDialogProps } from './types'

type ThemesConfig = {
  palettes: Record<string, string[]>
  templates: Record<string, number>
  masks: Record<string, { name: string }>
  themes: Record<string, ThemeDefinition>
}

const matchDarkMode = () =>
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null

function getPrefersScheme() {
  return matchDarkMode()?.matches ? 'dark' : 'light'
}

export class RootStore {
  // hardcoded for now
  static colors = ['red', 'orange', 'blue', 'purple', 'green', 'pink', 'yellow']

  async init() {
    matchDarkMode()?.addEventListener('change', () => {
      this.theme = getPrefersScheme()
    })

    if (isLocal) {
      await this.reloadTamaguiConfig()
    }
  }

  get scheme() {
    return this.theme.startsWith('dark') ? 'dark' : 'light'
  }

  projectName = ''
  fsReadSucceeded = false
  theme: ThemeName = getPrefersScheme()
  dialog: keyof DialogTypes = 'none'
  dialogProps: StudioDialogProps = {}

  config: null | TamaguiInternalConfig = null
  themes: null | ThemesConfig = null

  components = {
    components: {} as Components,
  }

  unwatchPreviousFileWatch?: () => void

  async reloadTamaguiConfig() {
    if (isLocal) {
      console.warn(`⚠️ disabled RootStore for now`)
      return

      const domain = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8081'
      const [configJson, themesJson] = await Promise.all([
        fetch(`${domain}/api/tamagui.config.json`).then((res) => res.json()),
        fetch(`${domain}/api/tamagui.themes.json`).then((res) => res.json()),
      ])

      await this.onReloadedTamaguiConfig(configJson)
      this.themes = themesJson
    } else {
      // TODO
      // try {
      //   this.unwatchPreviousFileWatch?.()
      //   this.unwatchPreviousFileWatch = await watchTamaguiDirectory((data) => {
      //     this.onReloadedTamaguiConfig(data.config)
      //     this.projectName = data.projectName
      //     this.fsReadSucceeded = true
      //   })
      // } catch (error: unknown) {
      //   console.error(error)
      //   if (error instanceof Error) {
      //     toastController.show('Error', {
      //       message: error.message,
      //       customData: {
      //         theme: 'red',
      //       },
      //     })
      //   }
      //   this.projectName = ''
      //   this.fsReadSucceeded = false
      // }
    }
    return null
  }

  async onReloadedTamaguiConfig(config: {
    tamaguiConfig: TamaguiInternalConfig
    components: Components
  }) {
    toastController.show('Config Updated.', {
      message: 'We picked up the new changes.',
      customData: { theme: 'green' },
    })

    this.components = {
      ...this.components,
      components: config.components,
    }

    // hacky workaround we're generating this wrong need to fix
    // @ts-ignore
    if (config.tamaguiConfig.config) {
      // @ts-ignore
      this.config = config.tamaguiConfig.config
    } else {
      const tamaguiConfig = config.tamaguiConfig as TamaguiInternalConfig
      this.config = tamaguiConfig
    }
  }

  // we can move this to a dialogStore

  confirmationCallback?: Function
  confirmationStatus?: boolean | null

  setConfirmationStatus(status: boolean) {
    this.confirmationStatus = status
  }

  async confirmDialog(name: keyof DialogTypes, props: StudioDialogProps) {
    const promise = new Promise<boolean>((res) => {
      this.confirmationCallback = res
    })

    this.showDialog(name, props)
    return await promise
  }

  showDialog(name: keyof DialogTypes, props: StudioDialogProps) {
    this.dialog = name
    this.dialogProps = props
    this.confirmationStatus = null
  }

  hideDialog() {
    this.dialog = 'none'
    this.dialogProps = {}
    const confirmed = Boolean(this.confirmationStatus)
    console.warn('2', confirmed, this.confirmationCallback)
    this.confirmationCallback?.(confirmed)
    this.confirmationStatus = null
  }
}

export const rootStore = createStore(RootStore)
