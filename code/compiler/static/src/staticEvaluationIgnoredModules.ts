import type { Plugin } from 'esbuild'

const tamaguiStaticEvaluationIgnoredModules = [
  // react-native-safe-area-context evaluates its native codegen spec in Node and
  // calls codegenNativeComponent, which is unavailable during static evaluation.
  'react-native-safe-area-context',
  // react-native-worklets initializes native JSI in Node, so static evaluation
  // uses the package's own mock while preserving the authored animation config.
  'react-native-worklets',
]

export function isIgnoredStaticEvaluationModule(
  moduleName: string,
  userIgnoredModules: readonly string[] = []
) {
  return (
    tamaguiStaticEvaluationIgnoredModules.includes(moduleName) ||
    userIgnoredModules.includes(moduleName)
  )
}

export function staticEvaluationIgnorePlugin(
  userIgnoredModules: readonly string[] = []
): Plugin {
  return {
    name: 'tamagui-static-evaluation-ignore',
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (isIgnoredStaticEvaluationModule(args.path, userIgnoredModules)) {
          return { path: args.path, namespace: 'tamagui-static-evaluation-ignore' }
        }
        return null
      })
      build.onLoad(
        { filter: /.*/, namespace: 'tamagui-static-evaluation-ignore' },
        (args) => ({
          contents:
            args.path === 'react-native-worklets'
              ? `module.exports = require('react-native-worklets/lib/module/mock.js')`
              : 'module.exports = {}',
          loader: 'js',
          resolveDir: build.initialOptions.absWorkingDir || process.cwd(),
        })
      )
    },
  }
}
