import type { Plugin } from 'esbuild'

export const tamaguiStaticEvaluationModules = Object.freeze({
  // react-native-safe-area-context evaluates its native codegen spec in Node and
  // calls codegenNativeComponent, which is unavailable during static evaluation.
  'react-native-safe-area-context': null,
  // react-native-worklets initializes native JSI in Node, so static evaluation
  // uses the package's own mock while preserving the authored animation config.
  // the vendor mock mutates _WORKLET, __RUNTIME_KIND, _log,
  // _getAnimationTimestamp, and requestAnimationFrame in the compiler process.
  'react-native-worklets': 'react-native-worklets/lib/module/mock.js',
} as const)

export function getStaticEvaluationModuleReplacement(moduleName: string) {
  return Object.hasOwn(tamaguiStaticEvaluationModules, moduleName)
    ? tamaguiStaticEvaluationModules[
        moduleName as keyof typeof tamaguiStaticEvaluationModules
      ]
    : undefined
}

export function isIgnoredStaticEvaluationModule(
  moduleName: string,
  userIgnoredModules: readonly string[] = []
) {
  return (
    getStaticEvaluationModuleReplacement(moduleName) !== undefined ||
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
        (args) => {
          const replacement = getStaticEvaluationModuleReplacement(args.path)
          return {
            contents: replacement
              ? `module.exports = require(${JSON.stringify(replacement)})`
              : 'module.exports = {}',
            loader: 'js',
            resolveDir: build.initialOptions.absWorkingDir || process.cwd(),
          }
        }
      )
    },
  }
}
