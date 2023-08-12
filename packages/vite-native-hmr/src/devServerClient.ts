import prettyFormat from 'pretty-format'

import { getDevServerLocation } from './getDevServerLocation'

/**
 * With Webpack we don't use built-in metro-specific HMR client,
 * so the module `react-native/Libraries/Utilities/HMRClient.js` should be replaced with this one.
 *
 * Most of the code is noop apart from the `log` function which handles sending logs from client
 * application to the dev server.
 *
 * The console gets "polyfilled" here:
 * https://github.com/facebook/react-native/blob/v0.63.4/Libraries/Core/setUpDeveloperTools.js#L51-L69
 */

class DevServerClient {
  socket?: WebSocket
  buffer: Array<{ level: string; data: any[] }> = []

  constructor() {
    const initSocket = () => {
      const address = `ws://${getDevServerLocation().host}/__client`
      this.socket = new WebSocket(address)

      const onClose = (event: Event) => {
        console.warn(
          'Disconnected from the Dev Server:',
          (event as unknown as { message: string | null }).message
        )
        this.socket = undefined
      }

      this.socket.onclose = onClose
      this.socket.onerror = onClose
      this.socket.onopen = () => {
        this.flushBuffer()
      }
    }

    if (process.env.NODE_ENV === 'development') {
      initSocket()
    }
  }

  send(level: string, data: any[]) {
    try {
      this.socket?.send(
        JSON.stringify({
          type: 'client-log',
          level,
          data: data.map((item: any) =>
            typeof item === 'string'
              ? item
              : prettyFormat(item, {
                  escapeString: true,
                  highlight: true,
                  maxDepth: 3,
                  min: true,
                  plugins: [
                    // @ts-expect-error
                    prettyFormat.plugins.ReactElement,
                  ],
                })
          ),
        })
      )
    } catch {
      // Ignore error
    }
  }

  flushBuffer() {
    for (const { level, data } of this.buffer) {
      this.send(level, data)
    }

    this.buffer = []
  }

  log(level: string, data: any[]) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.flushBuffer()
      this.send(level, data)
    } else {
      this.buffer.push({ level, data })
    }
  }
}

const client = new DevServerClient()

export const devServerClient = {
  setup() {},
  enable() {},
  disable() {},
  registerBundle() {},
  log(level: string, data: any[]) {
    client.log(level, data)
  },
}
