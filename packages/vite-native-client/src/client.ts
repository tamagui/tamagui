// import '@vite/env'

import type { InferCustomEventPayload } from './customEvent'
import type { ErrorPayload, HMRPayload, Update } from './hmrPayload'
import type { ModuleNamespace, ViteHotContext } from './hot'

// injected by the hmr plugin when served
declare const __BASE__: string
declare const __SERVER_HOST__: string
declare const __HMR_PROTOCOL__: string | null
declare const __HMR_HOSTNAME__: string | null
declare const __HMR_PORT__: number | null
declare const __HMR_DIRECT_TARGET__: string
declare const __HMR_BASE__: string
declare const __HMR_TIMEOUT__: number
declare const __HMR_ENABLE_OVERLAY__: boolean

console.log('[vite] connecting...')

const importMetaUrl = {
  hostname: '127.0.0.1',
  protocol: 'http',
  port: 5173,
}

// use server configuration, then fallback to inference
const serverHost = __SERVER_HOST__
const socketProtocol =
  __HMR_PROTOCOL__ || (importMetaUrl.protocol === 'https:' ? 'wss' : 'ws')
const hmrPort = __HMR_PORT__ || 5173

const socketHost = `${__HMR_HOSTNAME__ || importMetaUrl.hostname}:${
  hmrPort || importMetaUrl.port
}${__HMR_BASE__}`
const directSocketHost = __HMR_DIRECT_TARGET__
const base = __BASE__ || '/'
const messageBuffer: string[] = []

let socket: WebSocket

try {
  let fallback: (() => void) | undefined
  // only use fallback when port is inferred to prevent confusion
  if (!hmrPort) {
    fallback = () => {
      // fallback to connecting directly to the hmr server
      // for servers which does not support proxying websocket
      socket = setupWebSocket(socketProtocol, directSocketHost, () => {
        console.error(
          '[vite] failed to connect to websocket.\n' +
            'your current setup:\n' +
            `  (browser) ${JSON.stringify(
              importMetaUrl
            )} <--[HTTP]--> ${serverHost} (server)\n` +
            `  (browser) ${socketHost} <--[WebSocket (failing)]--> ${directSocketHost} (server)\n` +
            'Check out your Vite / network configuration and https://vitejs.dev/config/server-options.html#server-hmr .'
        )
      })
      socket.addEventListener(
        'open',
        () => {
          console.log(
            '[vite] Direct websocket connection fallback. Check out https://vitejs.dev/config/server-options.html#server-hmr to remove the previous connection error.'
          )
        },
        { once: true }
      )
    }
  }

  socket = setupWebSocket(socketProtocol, socketHost, fallback)
} catch (error) {
  console.error(`[vite] failed to connect to websocket (${error}). `)
}

function setupWebSocket(
  protocol: string,
  hostAndPath: string,
  onCloseWithoutOpen?: () => void
) {
  const endpoint = `${protocol}://${hostAndPath}`
  const socket = new WebSocket(endpoint, 'vite-hmr')
  let isOpened = false

  /**
   * WARNING: passing an async function as a callback to socket listeners silently fails on native
   */

  socket.addEventListener(
    'open',
    () => {
      isOpened = true
      notifyListeners('vite:ws:connect', { webSocket: socket })
    },
    { once: true }
  )

  // Listen for messages
  socket.addEventListener('message', ({ data }) => {
    console.log('🌶️' + data)
    handleMessage(JSON.parse(data))
  })

  socket.addEventListener('error', (err) => {
    console.log('err' + err['message'] + err['stack'])
  })

  // ping server
  socket.addEventListener('close', ({ wasClean }) => {
    if (wasClean) return

    if (!isOpened && onCloseWithoutOpen) {
      onCloseWithoutOpen()
      return
    }

    notifyListeners('vite:ws:disconnect', { webSocket: socket })

    console.log(`[vite] server connection lost. polling for restart...`)
    waitForSuccessfulPing(protocol, hostAndPath).then(() => {
      console.log('shuld reload')
      // location.reload()
    })
  })

  return socket
}

function warnFailedFetch(err: Error, path: string | string[]) {
  console.error(`${err}`)
  console.error(
    `[hmr] Failed to reload ${path}. ` +
      `This could be due to syntax errors or importing non-existent ` +
      `modules. (see errors above)`
  )
}

let isFirstUpdate = true

const debounceReload = (time: number) => {
  let timer: ReturnType<typeof setTimeout> | null
  return () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      location.reload()
    }, time)
  }
}
const pageReload = debounceReload(50)

async function handleMessage(payload: HMRPayload) {
  switch (payload.type) {
    case 'connected':
      console.log(`[vite] connected.`)
      sendMessageBuffer()
      // proxy(nginx, docker) hmr ws maybe caused timeout,
      // so send ping package let ws keep alive.
      setInterval(() => {
        if (socket.readyState === socket.OPEN) {
          socket.send('{"type":"ping"}')
        }
      }, __HMR_TIMEOUT__)
      break
    case 'update':
      notifyListeners('vite:beforeUpdate', payload)
      // if this is the first update and there's already an error overlay, it
      // means the page opened with existing server compile error and the whole
      // module script failed to load (since one of the nested imports is 500).
      // in this case a normal update won't work and a full reload is needed.
      if (isFirstUpdate && hasErrorOverlay()) {
        // !
        // window.location.reload()
        return
      } else {
        clearErrorOverlay()
        isFirstUpdate = false
      }
      await Promise.all(
        payload.updates.map((update) => {
          if (update.type === 'js-update') {
            return queueUpdate(fetchUpdate(update))
          }
        })
      )
      notifyListeners('vite:afterUpdate', payload)
      break
    case 'custom': {
      notifyListeners(payload.event, payload.data)
      break
    }
    case 'full-reload':
      notifyListeners('vite:beforeFullReload', payload)
      if (payload.path && payload.path.endsWith('.html')) {
        // if html file is edited, only reload the page if the browser is
        // currently on that page.
        const pagePath = decodeURI(location.pathname)
        const payloadPath = base + payload.path.slice(1)
        if (
          pagePath === payloadPath ||
          payload.path === '/index.html' ||
          (pagePath.endsWith('/') && pagePath + 'index.html' === payloadPath)
        ) {
          pageReload()
        }
        return
      } else {
        pageReload()
      }
      break
    case 'prune':
      notifyListeners('vite:beforePrune', payload)
      // After an HMR update, some modules are no longer imported on the page
      // but they may have left behind side effects that need to be cleaned up
      // (.e.g style injections)
      // TODO Trigger their dispose callbacks.
      payload.paths.forEach((path) => {
        const fn = pruneMap.get(path)
        if (fn) {
          fn(dataMap.get(path))
        }
      })
      break
    case 'error': {
      notifyListeners('vite:error', payload)
      const err = payload.err
      if (enableOverlay) {
        createErrorOverlay(err)
      } else {
        console.error(`[vite] Internal Server Error\n${err.message}\n${err.stack}`)
      }
      break
    }
    default: {
      const check: never = payload
      return check
    }
  }
}

function notifyListeners<T extends string>(
  event: T,
  data: InferCustomEventPayload<T>
): void
function notifyListeners(event: string, data: any): void {
  const cbs = customListenersMap.get(event)
  if (cbs) {
    cbs.forEach((cb) => cb(data))
  }
}

const enableOverlay = __HMR_ENABLE_OVERLAY__

function createErrorOverlay(err: ErrorPayload['err']) {
  if (!enableOverlay) return
  clearErrorOverlay()
  console.log('create error', err)
  // document.body.appendChild(new ErrorOverlay(err))
}

function clearErrorOverlay() {
  // document.querySelectorAll(overlayId).forEach((n) => (n as ErrorOverlay).close())
}

function hasErrorOverlay() {
  return false
  // return document.querySelectorAll(overlayId).length
}

let pending = false
let queued: Promise<(() => void) | undefined>[] = []

/**
 * buffer multiple hot updates triggered by the same src change
 * so that they are invoked in the same order they were sent.
 * (otherwise the order may be inconsistent because of the http request round trip)
 */
async function queueUpdate(p: Promise<(() => void) | undefined>) {
  queued.push(p)
  if (!pending) {
    pending = true
    await Promise.resolve()
    pending = false
    const loading = [...queued]
    queued = []
    ;(await Promise.all(loading)).forEach((fn) => fn && fn())
  }
}

async function waitForSuccessfulPing(
  socketProtocol: string,
  hostAndPath: string,
  ms = 1000
) {
  const pingHostProtocol = socketProtocol === 'wss' ? 'https' : 'http'

  const ping = async () => {
    // A fetch on a websocket URL will return a successful promise with status 400,
    // but will reject a networking error.
    // When running on middleware mode, it returns status 426, and an cors error happens if mode is not no-cors
    try {
      await fetch(`${pingHostProtocol}://${hostAndPath}`, {
        mode: 'no-cors',
        headers: {
          // Custom headers won't be included in a request with no-cors so (ab)use one of the
          // safelisted headers to identify the ping request
          Accept: 'text/x-vite-ping',
        },
      })
      return true
    } catch {}
    return false
  }

  if (await ping()) {
    return
  }
  await wait(ms)

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (await ping()) {
      break
    }
    await wait(ms)
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchUpdate({
  path,
  acceptedPath,
  timestamp,
  explicitImportRequired,
}: Update) {
  const mod = hotModulesMap.get(path)

  if (!mod) {
    // In a code-splitting project,
    // it is common that the hot-updating module is not loaded yet.
    // https://github.com/vitejs/vite/issues/721
    return
  }

  let fetchedModule: ModuleNamespace | undefined
  const isSelfUpdate = path === acceptedPath

  // determine the qualified callbacks before we re-import the modules
  const qualifiedCallbacks = mod.callbacks.filter(({ deps }) =>
    deps.includes(acceptedPath)
  )

  if (isSelfUpdate || qualifiedCallbacks.length > 0) {
    const disposer = disposeMap.get(acceptedPath)
    if (disposer) await disposer(dataMap.get(acceptedPath))
    const [acceptedPathWithoutQuery, query] = acceptedPath.split(`?`)
    try {
      const filePath = acceptedPathWithoutQuery
      const finalQuery = `file?file=${encodeURIComponent(filePath)}&${
        explicitImportRequired ? 'import&' : ''
      }t=${timestamp}${query ? `&${query}` : ''}`

      const scriptUrl =
        // re-route to our cjs endpoint
        `http://${serverHost.replace('5173', '8081')}` + finalQuery

      console.log(`fetching update: ${JSON.stringify({ path, mod, scriptUrl })}`)

      const source = await fetch(scriptUrl).then((res) => res.text())

      const evaluatedModule = eval(source)

      fetchedModule = evaluatedModule
    } catch (e) {
      warnFailedFetch(e as any, acceptedPath)
    }
  }

  return () => {
    for (const { deps, fn } of qualifiedCallbacks) {
      fn(deps.map((dep) => (dep === acceptedPath ? fetchedModule : undefined)))
    }
    const loggedPath = isSelfUpdate ? path : `${acceptedPath} via ${path}`
    console.log(`[vite] hot updated: ${loggedPath}`)
  }
}

function sendMessageBuffer() {
  if (socket.readyState === 1) {
    messageBuffer.forEach((msg) => socket.send(msg))
    messageBuffer.length = 0
  }
}

interface HotModule {
  id: string
  callbacks: HotCallback[]
}

interface HotCallback {
  // the dependencies must be fetchable paths
  deps: string[]
  fn: (modules: Array<ModuleNamespace | undefined>) => void
}

type CustomListenersMap = Map<string, ((data: any) => void)[]>

const hotModulesMap = new Map<string, HotModule>()
const disposeMap = new Map<string, (data: any) => void | Promise<void>>()
const pruneMap = new Map<string, (data: any) => void | Promise<void>>()
const dataMap = new Map<string, any>()
const customListenersMap: CustomListenersMap = new Map()
const ctxToListenersMap = new Map<string, CustomListenersMap>()

globalThis['createHotContext'] = function createHotContext(
  ownerPath: string
): ViteHotContext {
  if (!dataMap.has(ownerPath)) {
    dataMap.set(ownerPath, {})
  }

  // when a file is hot updated, a new context is created
  // clear its stale callbacks
  const mod = hotModulesMap.get(ownerPath)
  if (mod) {
    mod.callbacks = []
  }

  // clear stale custom event listeners
  const staleListeners = ctxToListenersMap.get(ownerPath)
  if (staleListeners) {
    for (const [event, staleFns] of staleListeners) {
      const listeners = customListenersMap.get(event)
      if (listeners) {
        customListenersMap.set(
          event,
          listeners.filter((l) => !staleFns.includes(l))
        )
      }
    }
  }

  const newListeners: CustomListenersMap = new Map()
  ctxToListenersMap.set(ownerPath, newListeners)

  function acceptDeps(deps: string[], callback: HotCallback['fn'] = () => {}) {
    const mod: HotModule = hotModulesMap.get(ownerPath) || {
      id: ownerPath,
      callbacks: [],
    }
    mod.callbacks.push({
      deps,
      fn: callback,
    })
    hotModulesMap.set(ownerPath, mod)
  }

  const hot: ViteHotContext = {
    get data() {
      return dataMap.get(ownerPath)
    },

    accept(deps?: any, callback?: any) {
      if (typeof deps === 'function' || !deps) {
        // self-accept: hot.accept(() => {})
        acceptDeps([ownerPath], ([mod]) => deps?.(mod))
      } else if (typeof deps === 'string') {
        // explicit deps
        acceptDeps([deps], ([mod]) => callback?.(mod))
      } else if (Array.isArray(deps)) {
        acceptDeps(deps, callback)
      } else {
        throw new Error(`invalid hot.accept() usage.`)
      }
    },

    // export names (first arg) are irrelevant on the client side, they're
    // extracted in the server for propagation
    acceptExports(_, callback) {
      acceptDeps([ownerPath], ([mod]) => callback?.(mod))
    },

    dispose(cb) {
      disposeMap.set(ownerPath, cb)
    },

    prune(cb) {
      pruneMap.set(ownerPath, cb)
    },

    // Kept for backward compatibility (#11036)
    // @ts-expect-error untyped
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    decline() {},

    // tell the server to re-perform hmr propagation from this module as root
    invalidate(message) {
      notifyListeners('vite:invalidate', { path: ownerPath, message })
      this.send('vite:invalidate', { path: ownerPath, message })
      console.log(`[vite] invalidate ${ownerPath}${message ? `: ${message}` : ''}`)
    },

    // custom events
    on(event, cb) {
      const addToMap = (map: Map<string, any[]>) => {
        const existing = map.get(event) || []
        existing.push(cb)
        map.set(event, existing)
      }
      addToMap(customListenersMap)
      addToMap(newListeners)
    },

    send(event, data) {
      messageBuffer.push(JSON.stringify({ type: 'custom', event, data }))
      sendMessageBuffer()
    },
  }

  return hot
}
