import { SourceMapPayload, createRequire } from 'module'

import { JscTarget, Output, ParserConfig, ReactConfig, transform } from '@swc/core'
import { PluginOption } from 'vite'

const resolve = createRequire(
  typeof __filename !== 'undefined' ? __filename : import.meta.url
).resolve
const refreshContentRE = /\$Refresh(?:Reg|Sig)\$\(/

type Options = {
  mode: 'serve' | 'serve-cjs' | 'build'

  /**
   * Control where the JSX factory is imported from.
   * @default "react"
   */
  jsxImportSource?: string
  /**
   * Enable TypeScript decorators. Requires experimentalDecorators in tsconfig.
   * @default false
   */
  tsDecorators?: boolean
  /**
   * Use SWC plugins. Enable SWC at build time.
   * @default undefined
   */
  plugins?: [string, Record<string, any>][]
}

const isWebContainer = globalThis.process?.versions?.webcontainer

export default (_options?: Options): PluginOption[] => {
  const options = {
    mode: _options?.mode ?? 'serve',
    jsxImportSource: _options?.jsxImportSource ?? 'react',
    tsDecorators: _options?.tsDecorators,
    plugins: _options?.plugins
      ? _options?.plugins.map((el): typeof el => [resolve(el[0]), el[1]])
      : undefined,
  }

  const hasTransformed = {}

  return [
    {
      name: 'vite:react-swc',

      config: (config) => {
        return {
          esbuild: false,

          build: {
            // idk why i need both..
            rollupOptions: {
              plugins: [
                {
                  name: `native-transform`,

                  async transform(code, id) {
                    let out = await transform(code, {
                      filename: id,
                      swcrc: false,
                      configFile: false,
                      sourceMaps: true,
                      jsc: {
                        target: 'es5',
                        parser: id.endsWith('.tsx')
                          ? { syntax: 'typescript', tsx: true, decorators: true }
                          : id.endsWith('.ts')
                          ? { syntax: 'typescript', tsx: false, decorators: true }
                          : id.endsWith('.jsx')
                          ? { syntax: 'ecmascript', jsx: true }
                          : { syntax: 'ecmascript' },
                        transform: {
                          useDefineForClassFields: true,
                          react: {
                            development: true,
                            runtime: 'automatic',
                          },
                        },
                      },
                    })

                    hasTransformed[id] = true
                    return out
                  },
                },
              ],
            },
          },
        }
      },

      configResolved(config) {
        const mdxIndex = config.plugins.findIndex((p) => p.name === '@mdx-js/rollup')
        if (
          mdxIndex !== -1 &&
          mdxIndex > config.plugins.findIndex((p) => p.name === 'vite:react-swc')
        ) {
          throw new Error(
            '[vite:react-swc] The MDX plugin should be placed before this plugin'
          )
        }
        if (isWebContainer) {
          config.logger.warn(
            '[vite:react-swc] SWC is currently not supported in WebContainers. You can use the default React plugin instead.'
          )
        }
      },

      async transform(code, _id, transformOptions) {
        if (hasTransformed[_id]) return
        if (_id.includes(`virtual:`)) {
          return
        }
        const out = await swcTransform(_id, code, options)
        hasTransformed[_id] = true
        return out
      },
    },
  ]
}

export async function swcTransform(_id: string, code: string, options: Options) {
  // todo hack
  const id = _id.split('?')[0].replace(process.cwd(), '')

  // const refresh = !transformOptions?.ssr && !hmrDisabled
  // only change for now:
  const refresh = true

  const result = await transformWithOptions(id, code, 'es5', options, {
    refresh,
    development: true,
    runtime: 'automatic',
    importSource: options.jsxImportSource,
  })

  if (!result) {
    return
  }

  if (!refresh || !refreshContentRE.test(result.code)) {
    return result
  }

  result.code = wrapSourceInRefreshRuntime(id, result.code, options)

  const sourceMap: SourceMapPayload = JSON.parse(result.map!)
  sourceMap.mappings = ';;;;;;;;' + sourceMap.mappings
  return { code: result.code, map: sourceMap }
}

export function wrapSourceInRefreshRuntime(id: string, code: string, options: Options) {
  const prefixCode =
    options.mode === 'build'
      ? `
  // ensure it loads react, react native, vite client
  import 'react-native'
  import 'react'
  import '@tamagui/vite-native-client'
  `
      : ``

  return `const RefreshRuntime = __cachedModules["react-native/node_modules/react-refresh/cjs/react-refresh-runtime.development"];
const prevRefreshReg = globalThis.$RefreshReg$;
const prevRefreshSig = globalThis.$RefreshSig$;
globalThis.$RefreshReg$ = (type, id) => RefreshRuntime.register(type, "${id}" + " " + id);
globalThis.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;

${prefixCode}

module.url = '${id}'
module.hot = createHotContext(module.url)

${code}

import.meta.hot.accept(() => {})

if (module.hot) {
  globalThis.$RefreshReg$ = prevRefreshReg;
  globalThis.$RefreshSig$ = prevRefreshSig;
  globalThis['lastHmrExports'] = JSON.stringify(Object.keys(exports))
    module.hot.accept((nextExports) => {
      RefreshRuntime.performReactRefresh()
    });
}
  `
}

export const transformForBuild = async (id: string, code: string) => {
  return await transform(code, {
    filename: id,
    swcrc: false,
    configFile: false,
    sourceMaps: true,
    jsc: {
      target: 'es2019',
      parser: id.endsWith('.tsx')
        ? { syntax: 'typescript', tsx: true, decorators: true }
        : id.endsWith('.ts')
        ? { syntax: 'typescript', tsx: false, decorators: true }
        : id.endsWith('.jsx')
        ? { syntax: 'ecmascript', jsx: true }
        : { syntax: 'ecmascript' },
      transform: {
        useDefineForClassFields: true,
        react: {
          development: true,
          runtime: 'automatic',
        },
      },
    },
  })
}

export const transformWithOptions = async (
  id: string,
  code: string,
  target: JscTarget,
  options: Options,
  reactConfig: ReactConfig
) => {
  const decorators = options?.tsDecorators ?? false
  const parser: ParserConfig | undefined = id.endsWith('.tsx')
    ? { syntax: 'typescript', tsx: true, decorators }
    : id.endsWith('.ts')
    ? { syntax: 'typescript', tsx: false, decorators }
    : id.endsWith('.jsx')
    ? { syntax: 'ecmascript', jsx: true }
    : id.endsWith('.mdx')
    ? // JSX is required to trigger fast refresh transformations, even if MDX already transforms it
      { syntax: 'ecmascript', jsx: true }
    : undefined
  if (!parser) return

  let result: Output
  try {
    result = await transform(code, {
      filename: id,
      swcrc: false,
      configFile: false,
      sourceMaps: true,
      module: {
        type: 'nodenext',
      },
      ...(options.mode === 'serve-cjs' && {
        module: {
          type: 'commonjs',
          strict: true,
          importInterop: 'node',
        },
      }),
      jsc: {
        target,
        parser,
        transform: {
          useDefineForClassFields: true,
          react: reactConfig,
        },
      },
    })
  } catch (e: any) {
    const message: string = e.message
    const fileStartIndex = message.indexOf('╭─[')
    if (fileStartIndex !== -1) {
      const match = message.slice(fileStartIndex).match(/:(\d+):(\d+)]/)
      if (match) {
        e.line = match[1]
        e.column = match[2]
      }
    }
    throw e
  }

  return result
}
