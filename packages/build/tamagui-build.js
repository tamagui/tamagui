#!/usr/bin/env node

const exec = require('execa')
const fs = require('fs-extra')
const esbuild = require('esbuild')
const fg = require('fast-glob')
const createExternalPlugin = require('./externalNodePlugin')
const path = require('path')

const skipJS = process.env.SKIP_JS || false
const skipTypes = process.argv.includes('skip-types') || process.env.SKIP_TYPES
const jsx = process.argv.includes('--jsx')
const watch = process.argv.includes('--watch')
const legacy = process.argv.includes('legacy')

const pkg = fs.readJSONSync('./package.json')
const pkgSource = pkg.source || 'src/index.ts'
const pkgMain = pkg.main
const pkgModule = pkg.module

async function build() {
  console.log('🥚', pkg.name)
  const x = Date.now()
  let files = (await fg(['src/**/*.ts', 'src/**/*.tsx'])).filter((x) => !x.includes('.d.ts'))

  if (process.env.NO_CLEAN) {
    console.log('skip typecheck')
  } else {
    fs.existsSync('tsconfig.tsbuildinfo') && fs.rmSync('tsconfig.tsbuildinfo')
  }

  async function buildTsc() {
    if (process.env.JS_ONLY || skipTypes) return
    try {
      if (legacy) {
        await exec('npx', [
          'tsc',
          '--declaration',
          '--emitDeclarationOnly',
          '--declarationMap',
          '--declarationDir',
          'types',
        ])
      } else {
        await exec(
          'npx',
          // was going super slow... --no-check for now..?
          ['dts-bundle-generator', watch ? '--no-check' : [], '-o', 'types.d.ts', pkgSource].flat()
        )
      }
    } catch (err) {
      console.log('Errors during tsc build, may be ok')
      console.log(err.message.replace(ignoreSkipLibCheckOutputRNNodeConflicting, ''))
    }
  }

  const externalPlugin = createExternalPlugin({
    skipNodeModulesBundle: true,
  })

  try {
    await Promise.all([
      buildTsc(),
      ...(skipJS
        ? []
        : [
            pkgMain
              ? esbuild
                  .build({
                    entryPoints: ['./src/index'],
                    outfile: pkgMain,
                    sourcemap: true,
                    target: 'node16',
                    bundle: true,
                    keepNames: true,
                    format: 'cjs',
                    color: true,
                    logLevel: 'error',
                    plugins: [externalPlugin],
                    minify: false,
                    platform: 'neutral',
                  })
                  .then(() => {
                    console.log(' >-> commonjs')
                  })
              : null,
            // dont bundle for tree shaking
            pkgModule
              ? esbuild
                  .build({
                    entryPoints: files,
                    outdir: 'dist',
                    sourcemap: true,
                    target: 'es2020',
                    keepNames: true,
                    format: 'esm',
                    color: true,
                    logLevel: 'error',
                    minify: false,
                    platform: 'neutral',
                  })
                  .then(() => {
                    console.log(' >-> esm')
                  })
              : null,
            jsx
              ? esbuild
                  .build({
                    // only diff is jsx preserve and outdir
                    jsx: 'preserve',
                    outdir: '_jsx',
                    entryPoints: files,
                    sourcemap: false,
                    target: 'es2020',
                    keepNames: true,
                    format: 'esm',
                    color: true,
                    logLevel: 'error',
                    minify: false,
                    platform: 'neutral',
                  })
                  .then(() => {
                    console.log(' >-> jsx')
                  })
              : null,
          ]),
    ])
  } catch (error) {
    console.log('error', error)
  } finally {
    console.log('built in', `${(Date.now() - x) / 1000}s`)
  }
}

if (watch) {
  const path = require('path')
  process.env.IS_WATCHING = true
  process.env.DISABLE_AUTORUN = true

  // TODO determine internal packages smarter
  const deps = [
    ...new Set([...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})]),
  ]
    .filter(Boolean)
    .filter((x) => x.includes(`tamagui`))

  const watchDirs = [
    'src',
    ...deps.flatMap((d) => {
      try {
        return path.dirname(require.resolve(d))
      } catch {
        const potentialDir = path.join('..', d.replace('@tamagui/', '') + '/dist')
        if (fs.existsSync(potentialDir)) {
          return potentialDir
        }
        return []
      }
    }),
  ]

  for (const dir of watchDirs) {
    if (dir === 'src') {
      build().then(() => watch())
    } else {
      watch()
    }

    const watchSize = {}
    function watch() {
      const finish = (event, path, stats) => {
        if (dir === 'src' || (stats && stats.size != watchSize[path])) {
          if (stats) watchSize[path] = stats.size
          console.log('watch build', dir)
          build()
        }
      }

      const chokidar = require('chokidar')
      chokidar
        // prevent infinite loop but cause race condition if you just build directly
        .watch(dir, {
          persistent: true,
          alwaysStat: true,
          ignoreInitial: true,
        })
        .on('change', finish)
        .on('add', finish)
    }
  }

  if (deps.length) {
    console.log('  ', pkg.name, '👀', deps.join(', '))
  }
} else {
  process.on('uncaughtException', console.log.bind(console))
  process.on('unhandledRejection', console.log.bind(console))
  build()
}

function debounce(callback, wait) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => callback(...args), wait)
  }
}

const ignoreSkipLibCheckOutputRNNodeConflicting = `../../node_modules/@types/node/globals.d.ts(47,11): error TS2300: Duplicate identifier 'AbortController'.
../../node_modules/@types/node/globals.d.ts(60,11): error TS2300: Duplicate identifier 'AbortSignal'.
../../node_modules/@types/node/globals.d.ts(67,13): error TS2300: Duplicate identifier 'AbortController'.
../../node_modules/@types/node/globals.d.ts(72,13): error TS2300: Duplicate identifier 'AbortSignal'.
../../node_modules/@types/react-native/globals.d.ts(50,13): error TS2403: Subsequent variable declarations must have the same type.  Variable 'Blob' must be of type '{ new (blobParts?: BlobPart[] | undefined, options?: BlobPropertyBag | undefined): Blob; prototype: Blob; }', but here has type '{ new (blobParts?: (string | Blob)[] | undefined, options?: BlobOptions | undefined): Blob; prototype: Blob; }'.
../../node_modules/@types/react-native/globals.d.ts(65,15): error TS2300: Duplicate identifier 'FormData'.
../../node_modules/@types/react-native/globals.d.ts(122,5): error TS2717: Subsequent property declarations must have the same type.  Property 'body' must be of type 'BodyInit | null | undefined', but here has type 'BodyInit_ | undefined'.
../../node_modules/@types/react-native/globals.d.ts(131,5): error TS2717: Subsequent property declarations must have the same type.  Property 'signal' must be of type 'AbortSignal | null | undefined', but here has type 'AbortSignal | undefined'.
../../node_modules/@types/react-native/globals.d.ts(149,14): error TS2300: Duplicate identifier 'RequestInfo'.
../../node_modules/@types/react-native/globals.d.ts(168,13): error TS2403: Subsequent variable declarations must have the same type.  Variable 'Response' must be of type '{ new (body?: BodyInit | null | undefined, init?: ResponseInit | undefined): Response; prototype: Response; error(): Response; redirect(url: string | URL, status?: number | undefined): Response; }', but here has type '{ new (body?: BodyInit_ | undefined, init?: ResponseInit | undefined): Response; prototype: Response; error: () => Response; redirect: (url: string, status?: number | undefined) => Response; }'.
../../node_modules/@types/react-native/globals.d.ts(245,5): error TS2717: Subsequent property declarations must have the same type.  Property 'abort' must be of type 'ProgressEvent<XMLHttpRequestEventTarget>', but here has type 'ProgressEvent<EventTarget>'.
../../node_modules/@types/react-native/globals.d.ts(246,5): error TS2717: Subsequent property declarations must have the same type.  Property 'error' must be of type 'ProgressEvent<XMLHttpRequestEventTarget>', but here has type 'ProgressEvent<EventTarget>'.
../../node_modules/@types/react-native/globals.d.ts(247,5): error TS2717: Subsequent property declarations must have the same type.  Property 'load' must be of type 'ProgressEvent<XMLHttpRequestEventTarget>', but here has type 'ProgressEvent<EventTarget>'.
../../node_modules/@types/react-native/globals.d.ts(248,5): error TS2717: Subsequent property declarations must have the same type.  Property 'loadend' must be of type 'ProgressEvent<XMLHttpRequestEventTarget>', but here has type 'ProgressEvent<EventTarget>'.
../../node_modules/@types/react-native/globals.d.ts(249,5): error TS2717: Subsequent property declarations must have the same type.  Property 'loadstart' must be of type 'ProgressEvent<XMLHttpRequestEventTarget>', but here has type 'ProgressEvent<EventTarget>'.
../../node_modules/@types/react-native/globals.d.ts(250,5): error TS2717: Subsequent property declarations must have the same type.  Property 'progress' must be of type 'ProgressEvent<XMLHttpRequestEventTarget>', but here has type 'ProgressEvent<EventTarget>'.
../../node_modules/@types/react-native/globals.d.ts(251,5): error TS2717: Subsequent property declarations must have the same type.  Property 'timeout' must be of type 'ProgressEvent<XMLHttpRequestEventTarget>', but here has type 'ProgressEvent<EventTarget>'.
../../node_modules/@types/react-native/globals.d.ts(292,14): error TS2300: Duplicate identifier 'XMLHttpRequestResponseType'.
../../node_modules/@types/react-native/globals.d.ts(299,15): error TS2300: Duplicate identifier 'URL'.
../../node_modules/@types/react-native/globals.d.ts(324,15): error TS2300: Duplicate identifier 'URLSearchParams'.
../../node_modules/@types/react-native/globals.d.ts(368,5): error TS2717: Subsequent property declarations must have the same type.  Property 'onopen' must be of type '((this: WebSocket, ev: Event) => any) | null', but here has type '(() => void) | null'.
../../node_modules/@types/react-native/globals.d.ts(369,5): error TS2717: Subsequent property declarations must have the same type.  Property 'onmessage' must be of type '((this: WebSocket, ev: MessageEvent<any>) => any) | null', but here has type '((event: WebSocketMessageEvent) => void) | null'.
../../node_modules/@types/react-native/globals.d.ts(370,5): error TS2717: Subsequent property declarations must have the same type.  Property 'onerror' must be of type '((this: WebSocket, ev: Event) => any) | null', but here has type '((event: WebSocketErrorEvent) => void) | null'.
../../node_modules/@types/react-native/globals.d.ts(371,5): error TS2717: Subsequent property declarations must have the same type.  Property 'onclose' must be of type '((this: WebSocket, ev: CloseEvent) => any) | null', but here has type '((event: WebSocketCloseEvent) => void) | null'.
../../node_modules/@types/react-native/globals.d.ts(372,5): error TS2717: Subsequent property declarations must have the same type.  Property 'addEventListener' must be of type '{ <K extends keyof WebSocketEventMap>(type: K, listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): void; (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | ... 1 more ... | undefined): void; }', but here has type 'WebsocketEventListener'.
../../node_modules/@types/react-native/globals.d.ts(373,5): error TS2717: Subsequent property declarations must have the same type.  Property 'removeEventListener' must be of type '{ <K extends keyof WebSocketEventMap>(type: K, listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any, options?: boolean | EventListenerOptions | undefined): void; (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | ... 1 more ... | undefined): void; }', but here has type 'WebsocketEventListener'.
../../node_modules/@types/react-native/globals.d.ts(376,13): error TS2403: Subsequent variable declarations must have the same type.  Variable 'WebSocket' must be of type '{ new (url: string | URL, protocols?: string | string[] | undefined): WebSocket; prototype: WebSocket; readonly CLOSED: number; readonly CLOSING: number; readonly CONNECTING: number; readonly OPEN: number; }', but here has type '{ new (uri: string, protocols?: string | string[] | null | undefined, options?: { [optionName: string]: any; headers: { [headerName: string]: string; }; } | null | undefined): WebSocket; ... 4 more ...; readonly OPEN: number; }'.
../../node_modules/@types/react-native/globals.d.ts(400,15): error TS2300: Duplicate identifier 'AbortSignal'.
../../node_modules/@types/react-native/globals.d.ts(400,15): error TS2420: Class 'AbortSignal' incorrectly implements interface 'EventTarget'.
  Property 'dispatchEvent' is missing in type 'AbortSignal' but required in type 'EventTarget'.
../../node_modules/@types/react-native/globals.d.ts(435,15): error TS2300: Duplicate identifier 'AbortController'.
../../node_modules/@types/react-native/globals.d.ts(460,14): error TS2717: Subsequent property declarations must have the same type.  Property 'error' must be of type 'DOMException | null', but here has type 'Error | null'.
../../node_modules/@types/react-native/globals.d.ts(468,14): error TS2717: Subsequent property declarations must have the same type.  Property 'result' must be of type 'string | ArrayBuffer | null', but here has type 'string | ArrayBuffer'.
../../node_modules/@types/react-native/node_modules/@types/react/index.d.ts(3094,14): error TS2300: Duplicate identifier 'LibraryManagedAttributes'.
../../node_modules/@types/react-native/node_modu`
