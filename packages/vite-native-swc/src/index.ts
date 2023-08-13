import { readFileSync } from 'fs'
import { SourceMapPayload } from 'module'
import { createRequire } from 'module'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import { JscTarget, Output, ParserConfig, ReactConfig, transform } from '@swc/core'
import { BuildOptions, PluginOption, UserConfig } from 'vite'

const runtimePublicPath = '/@react-refresh'

const preambleCode = `import { injectIntoGlobalHook } from "__PATH__";
injectIntoGlobalHook(globalThis);
globalThis.$RefreshReg$ = () => {};
globalThis.$RefreshSig$ = () => (type) => type;`

const _dirname =
  typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(import.meta.url))
const resolve = createRequire(
  typeof __filename !== 'undefined' ? __filename : import.meta.url
).resolve
const refreshContentRE = /\$Refresh(?:Reg|Sig)\$\(/

type Options = {
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

const react = (_options?: Options): PluginOption[] => {
  const options = {
    jsxImportSource: _options?.jsxImportSource ?? 'react',
    tsDecorators: _options?.tsDecorators,
    plugins: _options?.plugins
      ? _options?.plugins.map((el): typeof el => [resolve(el[0]), el[1]])
      : undefined,
  }

  return [
    {
      name: 'vite:react-swc:resolve-runtime',
      // apply: 'serve',
      enforce: 'pre', // Run before Vite default resolve to avoid syscalls
      resolveId: (id) => (id === runtimePublicPath ? id : undefined),
      load: (id) => {
        return id === runtimePublicPath
          ? readFileSync(join(_dirname, 'refresh-runtime.js'), 'utf-8')
          : undefined
      },
    },
    {
      name: 'vite:react-swc',
      // apply: 'serve',
      config: () => ({
        esbuild: false,
        optimizeDeps: {
          include: [`${options.jsxImportSource}/jsx-dev-runtime`],
        },
      }),
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
      transformIndexHtml: (_, config) => [
        {
          tag: 'script',
          attrs: { type: 'module' },
          children: preambleCode.replace(
            '__PATH__',
            config.server!.config.base + runtimePublicPath.slice(1)
          ),
        },
      ],
      async transform(code, _id, transformOptions) {
        const id = _id.split('?')[0]
        // const refresh = !transformOptions?.ssr && !hmrDisabled
        // only change for now:
        const refresh = true

        const result = await transformWithOptions(id, code, 'es2020', options, {
          refresh,
          development: true,
          runtime: 'automatic',
          importSource: options.jsxImportSource,
        })

        if (!result) return

        if (!refresh || !refreshContentRE.test(result.code)) {
          return result
        }

        result.code = wrapSourceInRefreshRuntime(id, result.code)

        const sourceMap: SourceMapPayload = JSON.parse(result.map!)
        sourceMap.mappings = ';;;;;;;;' + sourceMap.mappings
        return { code: result.code, map: sourceMap }
      },
    },
    options.plugins
      ? {
          name: 'vite:react-swc',
          apply: 'build',
          enforce: 'pre', // Run before esbuild
          config: (userConfig) => ({
            build: silenceUseClientWarning(userConfig),
          }),
          transform: (code, _id) =>
            transformWithOptions(_id.split('?')[0], code, 'esnext', options, {
              runtime: 'automatic',
              importSource: options.jsxImportSource,
            }),
        }
      : {
          name: 'vite:react-swc',
          apply: 'build',
          config: (userConfig) => ({
            build: silenceUseClientWarning(userConfig),
            esbuild: {
              jsx: 'automatic',
              jsxImportSource: options.jsxImportSource,
              tsconfigRaw: {
                compilerOptions: { useDefineForClassFields: true },
              },
            },
          }),
        },
  ]
}

export function wrapSourceInRefreshRuntime(id: string, code: string, cjs = false) {
  return `const RefreshRuntime = require("${runtimePublicPath}");

  // if (!globalThis.$RefreshReg$) throw new Error("React refresh preamble was not loaded. Something is wrong.");
  const prevRefreshReg = globalThis.$RefreshReg$;
  const prevRefreshSig = globalThis.$RefreshSig$;
  globalThis.$RefreshReg$ = RefreshRuntime.getRefreshReg("${id}");
  globalThis.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
  
  ${code}
  
  ${
    cjs
      ? ''
      : `// this lets us connect and accept it in browser so vite treats it as hmr for native
  if (import.meta.hot) {
    RefreshRuntime.__hmr_import(import.meta.url).then(() => {
      import.meta.hot.accept(() => {
    
      })
    })
  }`
  }
  
  if (module.hot) {
    globalThis.$RefreshReg$ = prevRefreshReg;
    globalThis.$RefreshSig$ = prevRefreshSig;
    globalThis['lastHmrExports'] = JSON.stringify(Object.keys(exports))
    RefreshRuntime.__hmr_import(module.url, exports).then((currentExports) => {
      console.log("HMRimport" + JSON.stringify(Object.keys(currentExports)) + JSON.stringify(Object.keys(exports)))
      RefreshRuntime.registerExportsForReactRefresh("${id}", currentExports);
      module.hot.accept((nextExports) => {
        console.log("ACEPT" + Object.keys(nextExports))
        if (!nextExports) return;
        const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate(currentExports, nextExports);
        console.log("invalidateMessage", + invalidateMessage)
        if (invalidateMessage) module.hot.invalidate(invalidateMessage);
      });
    });
  }
  `
}

const transformWithOptions = async (
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
      // module: {
      //   type: 'commonjs',
      // },
      jsc: {
        target,
        parser,
        experimental: { plugins: options.plugins },
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

const silenceUseClientWarning = (userConfig: UserConfig): BuildOptions => ({
  rollupOptions: {
    onwarn(warning, defaultHandler) {
      if (
        warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
        warning.message.includes('use client')
      ) {
        return
      }
      if (userConfig.build?.rollupOptions?.onwarn) {
        userConfig.build.rollupOptions.onwarn(warning, defaultHandler)
      } else {
        defaultHandler(warning)
      }
    },
  },
})

export default react
