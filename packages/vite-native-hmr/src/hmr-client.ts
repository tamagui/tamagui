import { getDevServerLocation } from './getDevServerLocation'

/**
 * Represent Hot Module Replacement Update body.
 *
 * @internal
 */
export interface HMRMessageBody {
  name: string
  time: number
  hash: string
  warnings: any[]
  errors: any[]
  modules: Record<string, string>
}

/**
 * Represent Hot Module Replacement Update message.
 *
 * @internal
 */
export interface HMRMessage {
  action: 'building' | 'built' | 'sync'
  body: HMRMessageBody | null
}

class HMRClient {
  url: string
  socket: WebSocket
  lastHash = ''

  constructor(
    private app: {
      reload: () => void
      dismissErrors: () => void
      LoadingView: {
        showMessage(text: string, type: 'load' | 'refresh'): void
        hide(): void
      }
    }
  ) {
    this.url = `ws://${getDevServerLocation().hostname}:${
      process.env.REACT_NATIVE_SERVER_PUBLIC_PORT
    }/__hmr?platform=${process.env.REACT_NATIVE_PLATFORM || 'ios'}`

    this.socket = new WebSocket(this.url)

    console.log('[HMRClient] Connecting...')

    this.socket.onopen = () => {
      console.log('[HMRClient] Connected')
    }

    this.socket.onclose = () => {
      console.log(`[HMRClient] Disconnected ${this.url}`)
    }

    this.socket.onerror = (event) => {
      console.log('[HMRClient] Error', event)
    }

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data.toString())
        this.processMessage(data)
      } catch (error) {
        console.warn('[HMRClient] Invalid HMR message', error)
      }
    }
  }

  upToDate(hash?: string) {
    if (hash) {
      this.lastHash = hash
    }
    // @ts-expect-error will deal with this when we get to it
    return this.lastHash === __webpack_hash__
  }

  processMessage(message: HMRMessage) {
    switch (message.action) {
      case 'building':
        this.app.LoadingView.showMessage('Rebuilding...', 'refresh')
        console.log('[HMRClient] Bundle rebuilding', {
          name: message.body?.name,
        })
        break
      case 'built':
        console.log('[HMRClient] Bundle rebuilt', {
          name: message.body?.name,
          time: message.body?.time,
        })
      // Fall through
      case 'sync':
        if (!message.body) {
          console.warn('[HMRClient] HMR message body is empty')
          return
        }

        if (message.body.errors?.length) {
          message.body.errors.forEach((error) => {
            console.error('Cannot apply update due to error:', error)
          })
          this.app.LoadingView.hide()
          return
        }

        if (message.body.warnings?.length) {
          message.body.warnings.forEach((warning) => {
            console.warn('[HMRClient] Bundle contains warnings:', warning)
          })
        }

        this.applyUpdate(message.body)
    }
  }

  applyUpdate(update: HMRMessageBody) {
    if (!module.hot) {
      throw new Error('[HMRClient] Hot Module Replacement is disabled.')
    }

    if (!this.upToDate(update.hash) && module.hot.status() === 'idle') {
      console.log('[HMRClient] Checking for updates on the server...')
      this.checkUpdates(update)
    }
  }

  async checkUpdates(update: HMRMessageBody) {
    try {
      this.app.LoadingView.showMessage('Refreshing...', 'refresh')
      const updatedModules = await module.hot?.check(false)
      if (!updatedModules) {
        console.warn('[HMRClient] Cannot find update - full reload needed')
        this.app.reload()
        return
      }

      const renewedModules = await module.hot?.apply({
        ignoreDeclined: true,
        ignoreUnaccepted: false,
        ignoreErrored: false,
        onDeclined: (data) => {
          // This module declined update, no need to do anything
          console.warn('[HMRClient] Ignored an update due to declined module', {
            chain: data.chain,
          })
        },
      })

      if (!this.upToDate()) {
        this.checkUpdates(update)
      }

      // Double check to make sure all updated modules were accepted (renewed)
      const unacceptedModules = updatedModules.filter((moduleId) => {
        return renewedModules && renewedModules.indexOf(moduleId) < 0
      })

      if (unacceptedModules.length) {
        console.warn('[HMRClient] Not every module was accepted - full reload needed', {
          unacceptedModules,
        })
        this.app.reload()
      } else {
        console.log('[HMRClient] Renewed modules - app is up to date', {
          renewedModules,
        })
        this.app.dismissErrors()
      }
    } catch (error) {
      if (module.hot?.status() === 'fail' || module.hot?.status() === 'abort') {
        console.warn('[HMRClient] Cannot check for update - full reload needed')
        console.warn('[HMRClient]', error)
        this.app.reload()
      } else {
        console.warn('[HMRClient] Update check failed', { error })
      }
    } finally {
      this.app.LoadingView.hide()
    }
  }
}

export const loadHMRClient = () => {
  const { DevSettings, Platform } = require('react-native')
  const LoadingView = require('react-native/Libraries/Utilities/LoadingView')

  const reload = () => DevSettings.reload()
  const dismissErrors = () => {
    if (Platform.OS === 'ios') {
      const NativeRedBox =
        require('react-native/Libraries/NativeModules/specs/NativeRedBox').default
      NativeRedBox?.dismiss?.()
    } else {
      const NativeExceptionsManager =
        require('react-native/Libraries/Core/NativeExceptionsManager').default
      NativeExceptionsManager?.dismissRedbox()
    }

    const LogBoxData = require('react-native/Libraries/LogBox/Data/LogBoxData')
    LogBoxData.clear()
  }

  new HMRClient({ reload, dismissErrors, LoadingView })
}
