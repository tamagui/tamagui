// react-native-safe-area-context evaluates its native codegen spec in Node and
// calls codegenNativeComponent, which is unavailable during static evaluation.
const tamaguiStaticEvaluationIgnoredModules = ['react-native-safe-area-context']

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
        () => ({ contents: 'module.exports = {}', loader: 'js' })
      )
    },
  }
}
import type { Plugin } from 'esbuild'
