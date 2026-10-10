import { GlobalWindow, Window } from 'happy-dom'
import { type Environment, populateGlobal } from 'vitest/runtime'

const additionalKeys = [
  'Request',
  'Response',
  'MessagePort',
  'fetch',
  'Headers',
  'AbortController',
  'AbortSignal',
  'URL',
  'URLSearchParams',
  'FormData',
]

const environment: Environment = {
  name: 'happy-dom-ssr',
  // The static compiler uses Node's filesystem and module APIs, while its
  // evaluation context must keep the same browser globals as our web tests.
  viteEnvironment: 'ssr',
  async setup(global, { happyDOM = {} }) {
    const WindowConstructor = GlobalWindow || Window
    const window = new WindowConstructor({
      ...happyDOM,
      console: global.console,
      url: happyDOM.url || 'http://localhost:3000',
      settings: {
        ...happyDOM.settings,
        disableErrorCapturing: true,
      },
    })
    const { keys, originals } = populateGlobal(global, window, {
      bindFunctions: true,
      additionalKeys,
    })

    return {
      async teardown() {
        if (window.close && window.happyDOM.abort) {
          await window.happyDOM.abort()
          window.close()
        } else {
          window.happyDOM.cancelAsync()
        }
        keys.forEach((key) => delete global[key])
        originals.forEach((value, key) => {
          global[key] = value
        })
      },
    }
  },
}

export default environment
