import type { TamaguiOptions } from '@tamagui/static'
import type { Compiler, RuleSetRule } from 'webpack'

type PluginOptions = TamaguiOptions & {
  commonjs?: boolean
  exclude?: RuleSetRule['exclude']
  test?: RuleSetRule['test']
  jsLoader?: any
}

export class TamaguiPlugin {
  pluginName = 'TamaguiPlugin'

  constructor(
    public options: PluginOptions = {
      components: ['@tamagui/core'],
    }
  ) {}

  apply(compiler: Compiler) {
    // mark as side effect
    compiler.hooks.normalModuleFactory.tap(this.pluginName, (nmf) => {
      nmf.hooks.createModule.tap(
        this.pluginName,
        // @ts-expect-error CreateData is typed as 'object'...
        (createData: { matchResource?: string; settings: { sideEffects?: boolean } }) => {
          if (createData.matchResource && createData.matchResource.endsWith('.tamagui.css')) {
            createData.settings.sideEffects = true
          }
        }
      )
    })

    compiler.options.resolve.extensions = [
      ...new Set([
        '.web.tsx',
        '.web.ts',
        '.web.js',
        ...(compiler.options.resolve.extensions || []),
      ]),
    ]

    // look for compiled js with jsx intact as specified by module:jsx
    const mainFields = compiler.options.resolve.mainFields
    if (mainFields) {
      compiler.options.resolve.mainFields = Array.isArray(mainFields) ? mainFields : [mainFields]
      mainFields.unshift('module:jsx')
    }

    if (!compiler.options.module) {
      return
    }

    const { jsLoader } = this.options

    const existing = compiler.options.module.rules as any[]

    const rules =
      (existing.find((x) => (typeof x === 'object' && 'oneOf' in x ? x : null))?.oneOf as any[]) ??
      existing

    const nextJsRules = rules.findIndex(
      (x) => x && x.use && x.use.loader === 'next-swc-loader' && x.issuerLayer !== 'api'
    )

    const startIndex = nextJsRules ? nextJsRules + 1 : 0
    const swcLoader = nextJsRules ? rules[startIndex] : undefined

    rules.splice(startIndex, 0, {
      test: this.options.test ?? /\.(jsx?|tsx?)$/,
      exclude: this.options.exclude,
      use: [
        ...(jsLoader ? [jsLoader] : []),
        ...(swcLoader && nextJsRules ? [].concat(swcLoader.use) : []),
        ...(!jsLoader && !swcLoader
          ? [
              {
                loader: require.resolve('esbuild-loader'),
                options: {
                  target: 'es2021',
                  keepNames: true,
                  loader: { '.tsx': 'tsx', '.png': 'copy', '.jpg': 'copy', '.gif': 'copy' },

                  tsconfigRaw: {
                    module: this.options.commonjs ? 'commonjs' : 'esnext',
                    isolatedModules: true,
                    jsx: 'preserve',
                    resolveJsonModule: true,
                  },
                },
              },
            ]
          : []),
        {
          loader: require.resolve('tamagui-loader'),
          options: this.options,
        },
      ],
    })
  }
}
