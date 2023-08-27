import { readFile } from 'fs/promises'
import { dirname } from 'path'

import commonjs from '@rollup/plugin-commonjs'
import { transform } from '@swc/core'
import { parse } from 'es-module-lexer'
import { OutputOptions } from 'rollup'
import type { Plugin } from 'vite'
import { viteExternalsPlugin } from 'vite-plugin-externals'

import { extensions } from './extensions'
import { getVitePath } from './getVitePath'
import { prebuiltFiles } from './nativePrebuild'

export function nativePlugin(options: { port: number; mode: 'build' | 'serve' }): Plugin {
  return {
    name: 'tamagui-native',
    enforce: 'post',

    config: async (config) => {
      config.define ||= {}
      config.define['process.env.REACT_NATIVE_SERVER_PUBLIC_PORT'] = JSON.stringify(
        `${options.port}`
      )
      config.define['process.env.REACT_NATIVE_PLATFORM'] = JSON.stringify(`ios`)

      if (!config.build) config.build = {}

      config.build.modulePreload = { polyfill: false }
      // Ensures that even very large assets are inlined in your JavaScript.
      config.build.assetsInlineLimit = 100000000
      // Avoid warnings about large chunks.
      config.build.chunkSizeWarningLimit = 100000000
      // Emit all CSS as a single file, which `vite-plugin-singlefile` can then inline.
      config.build.cssCodeSplit = false
      // Avoids the extra step of testing Brotli compression, which isn't really pertinent to a file served locally.
      config.build.reportCompressedSize = false
      // Subfolder bases are not supported, and shouldn't be needed because we're embedding everything.
      config.base = undefined

      config.resolve ??= {}

      config.resolve.extensions = extensions

      config.optimizeDeps ??= {}

      config.optimizeDeps.disabled = false
      // config.optimizeDeps.force = true
      config.optimizeDeps.include = ['escape-string-regexp']
      config.optimizeDeps.exclude = ['react-native']

      // config.optimizeDeps.needsInterop ??= []
      // config.optimizeDeps.needsInterop.push('react-native')

      // config.esbuild = false

      config.optimizeDeps.esbuildOptions ??= {}
      config.optimizeDeps.esbuildOptions.resolveExtensions = extensions

      config.optimizeDeps.esbuildOptions.plugins ??= []

      config.optimizeDeps.esbuildOptions.alias = {
        'react-native': '@tamagui/proxy-worm',
      }

      // config.optimizeDeps.esbuildOptions.plugins.push(
      //   esbuildFlowPlugin(
      //     /node_modules\/(react-native\/|@react-native\/)/,
      //     (_) => 'jsx',
      //     {
      //       all: true,
      //     }
      //   )
      // )

      config.optimizeDeps.esbuildOptions.loader ??= {}
      config.optimizeDeps.esbuildOptions.loader['.js'] = 'jsx'

      // console.log('>/')
      config.optimizeDeps.esbuildOptions.plugins.push({
        name: 'react-native-subpath-import',
        setup(build) {
          build.onResolve(
            {
              filter: /react-native.*/,
            },
            async ({ path, namespace }) => {
              return {
                path: require.resolve('@tamagui/proxy-worm'),
              }
            }
          )
        },
      })

      config.optimizeDeps.esbuildOptions.plugins.push({
        name: 'react-native-assets',
        setup(build) {
          build.onResolve(
            {
              filter: /\.(png|jpg|gif|webp)$/,
            },
            async ({ path, namespace }) => {
              return {
                path: '',
                external: true,
              }
            }
          )
        },
      })

      config.build.rollupOptions ??= {}

      config.build.rollupOptions.input = config.root

      config.build.rollupOptions.output ??= {}

      config.build.rollupOptions.plugins ??= []

      if (options.mode === 'serve') {
        config.build.rollupOptions.external = [
          'react-native',
          'react',
          'react/jsx-runtime',
          'react/jsx-dev-runtime',
        ]
      }

      if (!Array.isArray(config.build.rollupOptions.plugins)) {
        throw `xxxxx`
      }

      if (options.mode === 'build') {
        config.plugins ||= []
        // config.plugins.push(
        //   viteCommonjs({
        //     include: ['escape-string-regexp'],
        //   })
        // )
        // config.plugins.push(
        //   commonjs({
        //     filter(id) {
        //       console.log('id', id)
        //       return true
        //     },
        //   })
        // )

        config.build.rollupOptions.plugins.push(
          commonjs({
            transformMixedEsModules: true,
            include:
              /node_modules\/(escape-regex|use-latest-callback|react-is|react-native-screens|warn-once|color|@bacons\/react-views|invariant|expo-modules-core|qs|url-parse|@expo|color-string)\//,
          }) as any
        )

        config.build.rollupOptions.plugins.unshift({
          name: `swap-react-native-modules`,

          async transform(code, id) {
            // HACK
            if (id.includes('react-native-screens/lib/module/index.native.js')) {
              return (
                code +
                `
              export { 
                ScreenStackHeaderBackButtonImage,
                Screen,
                ScreenContainer,
                ScreenContext,
                ScreenStack,
                InnerScreen,
                SearchBar,
                FullWindowOverlay,
                ScreenStackHeaderRightView,
                ScreenStackHeaderLeftView,
                ScreenStackHeaderCenterView,
                ScreenStackHeaderSearchBarView,
                enableScreens,
                enableFreeze,
                screensEnabled,
                shouldUseActivityState,
                useTransitionProgress,
                isSearchBarAvailableForCurrentPlatform,
                isNewBackTitleImplementation,
                executeNativeBackPress
              }
              export const NativeScreen = ScreensNativeModules.NativeScreen;
              export const NativeScreenContainer = ScreensNativeModules.NativeScreenContainer;
              export const NativeScreenNavigationContainer = NativeScreenNavigationContainer;
              export const ScreenStackHeaderConfig = ScreensNativeModules.NativeScreenStackHeaderConfig;
              export const ScreenStackHeaderSubview = NativeScreenStackHeaderSubview;
              export const SearchBarCommands = ScreensNativeModules.NativeSearchBarCommands;
`
              )
            }
          },
        })

        const bundled = await readFile(prebuiltFiles.reactNative, 'utf-8')
        const rnCode = `
              const run = () => {  
                ${bundled
                  .replace(
                    `module.exports = require_react_native();`,
                    `return require_react_native();`
                  )
                  .replace(
                    `var require_jsx_runtime = `,
                    `var require_jsx_runtime = global['__JSX__'] = `
                  )
                  .replace(
                    `var require_react = `,
                    `var require_react = global['__React__'] = `
                  )}
              }
              const RN = run()
              ${RNExportNames.map((n) => `export const ${n} = RN.${n}`).join('\n')}
              `

        config.build.rollupOptions.plugins.push({
          name: `swap-react-native`,

          async load(id) {
            // TODO we need to resolve these to the inner deps...
            if (id.includes('react-native/Libraries')) {
              return `export default function() {}`
            }

            if (id.includes('node_modules/react-native/') && id.endsWith('.js')) {
              return {
                code: rnCode,
              }
            }
          },
        })

        config.build.rollupOptions.plugins.push(
          viteExternalsPlugin(
            {
              react: '____react____',
              'react/jsx-runtime': '____jsx____',
              'react/jsx-dev-runtime': '____jsx____',
            },
            {
              useWindow: false,
            }
          )
        )

        config.build.rollupOptions.plugins.push({
          name: `native-transform`,

          async transform(code, id) {
            if (
              id.includes(`node_modules/react/jsx-dev-runtime.js`) ||
              id.includes(`node_modules/react/index.js`) ||
              id.includes(`node_modules/react/cjs/react.development.js`) ||
              id.includes(`node_modules/react-native/index.js`) ||
              id.includes(
                `node_modules/react/cjs/react-jsx-dev-runtime.development.js`
              ) ||
              id.includes(`packages/vite-native-client/`)
            ) {
              return
            }

            try {
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
                      refresh: false,
                      runtime: 'automatic',
                    },
                  },
                },
              })

              return out
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
          },
        })

        config.build.rollupOptions.plugins.push({
          name: `force-export-all`,

          async transform(code, id) {
            if (!id.endsWith('.js')) {
              return
            }

            try {
              const [imports, exports] = parse(code)

              let forceExports = ''

              // note that es-module-lexer parses export * from as an import (twice) for some reason
              let counts = {}
              for (const imp of imports) {
                if (imp.n && imp.n[0] !== '.') {
                  counts[imp.n] ||= 0
                  counts[imp.n]++
                  if (counts[imp.n] == 2) {
                    // star export
                    const path = await getVitePath(dirname(id), imp.n)
                    forceExports += `Object.assign(exports, require("${path}"));`
                  }
                }
              }

              forceExports += exports
                .map((e) => {
                  if (e.n === 'default') {
                    return ''
                  }
                  let out = ''
                  if (e.ln !== e.n) {
                    // forces the "as x" to be referenced so it gets exported
                    out += `__ignore = typeof ${e.n} === 'undefined' ? 0 : 0;`
                  }
                  out += `globalThis.____forceExport = ${e.ln}`
                  return out
                })
                .join(';')

              return code + '\n' + forceExports
            } catch (err) {
              console.log(`Error forcing exports for id ${id} ${err}`)
            }
          },
        })

        config.build.rollupOptions.plugins.unshift({
          name: `swap-expo-router`,

          async transform(code, id) {
            if (id.endsWith('expo-router/src/views/Try.tsx')) {
              // force this type only export
              return code + `\nexport const ErrorBoundaryProps = {}`
            }
          },
        })
      }

      if (process.env.DEBUG) {
        console.log('config..', config)
      }

      config.build.commonjsOptions = {
        include: [/node_modules\/react\/|query-string/],
      }

      const updateOutputOptions = (out: OutputOptions) => {
        out.preserveModules = true

        out.entryFileNames = (chunkInfo) => {
          // ensures we have clean names for our require paths
          return '[name].js'
        }
        // Ensure that as many resources as possible are inlined.
        // out.inlineDynamicImports = true

        // added by me (nate):
        out.manualChunks = undefined
      }

      if (Array.isArray(config.build.rollupOptions.output)) {
        for (const o in config.build.rollupOptions.output)
          updateOutputOptions(o as OutputOptions)
      } else {
        updateOutputOptions(config.build.rollupOptions.output as OutputOptions)
      }
    },
  }
}

const RNExportNames = [
  'AccessibilityInfo',
  'ActivityIndicator',
  'Button',
  'DrawerLayoutAndroid',
  'FlatList',
  'Image',
  'ImageBackground',
  'InputAccessoryView',
  'KeyboardAvoidingView',
  'Modal',
  'Pressable',
  'RefreshControl',
  'SafeAreaView',
  'ScrollView',
  'SectionList',
  'StatusBar',
  'Switch',
  'Text',
  'TextInput',
  'Touchable',
  'TouchableHighlight',
  'TouchableNativeFeedback',
  'TouchableOpacity',
  'TouchableWithoutFeedback',
  'View',
  'VirtualizedList',
  'VirtualizedSectionList',
  'ActionSheetIOS',
  'Alert',
  'Animated',
  'Appearance',
  'AppRegistry',
  'AppState',
  'BackHandler',
  'DeviceInfo',
  'DevSettings',
  'Dimensions',
  'Easing',
  'findNodeHandle',
  'I18nManager',
  'InteractionManager',
  'Keyboard',
  'LayoutAnimation',
  'Linking',
  'LogBox',
  'NativeDialogManagerAndroid',
  'NativeEventEmitter',
  'Networking',
  'PanResponder',
  'PermissionsAndroid',
  'PixelRatio',
  // 'PushNotificationIOS',
  'Settings',
  'Share',
  'StyleSheet',
  'Systrace',
  'ToastAndroid',
  'TurboModuleRegistry',
  'UIManager',
  'unstable_batchedUpdates',
  'useColorScheme',
  'useWindowDimensions',
  'UTFSequence',
  'Vibration',
  'YellowBox',
  'DeviceEventEmitter',
  'DynamicColorIOS',
  'NativeAppEventEmitter',
  'NativeModules',
  'Platform',
  'PlatformColor',
  'processColor',
  'requireNativeComponent',
  'RootTagContext',
  // 'unstable_enableLogBox',
  // 'ColorPropType',
  // 'EdgeInsetsPropType',
  // 'PointPropType',
  // 'ViewPropTypes',
]

// failed attempt to get vite to bundle rn, after a bunch of hacks still trouble

//         config.build.rollupOptions.plugins.push({
//           name: 'flow-remove-types',
//           transform: async (codeIn, id) => {
//             if (!id.includes('node_modules')) {
//               return
//             }
//             const flowRemoved = flowRemoveTypes(codeIn).toString()
//             let jsxRemoved = await nativeBabelRemoveJSX(flowRemoved)

//             if (id.includes('BackHandler')) {
//               jsxRemoved = jsxRemoved.replace(
//                 `module.exports = require('../Components/UnimplementedViews/UnimplementedView');`,
//                 ''
//               )
//             }

//             if (jsxRemoved.includes(`module.exports = `)) {
//               jsxRemoved = jsxRemoved.replace(
//                 /\nmodule.exports = /gi,
//                 `\nexport default `
//               )
//             }

//             if (id.endsWith('ReactNativeViewConfigRegistry.js')) {
//               jsxRemoved =
//                 jsxRemoved +
//                 `\nconst allExports = {...exports }; export default allExports;`
//             }

//             if (id.endsWith('ExceptionsManager.js')) {
//               console.log('huh', id)
//               jsxRemoved = jsxRemoved
//                 .replace(/\nfunction /g, 'export function')
//                 .replace('class SynthenticEvent', 'export class SyntheticEvent')
//                 .replace(
//                   `module.exports = {
//   decoratedExtraDataKey,
//   handleException,
//   installConsoleErrorReporter,
//   SyntheticError,
//   unstable_setExceptionDecorator,
// };`,
//                   ``
//                 )
//             }

//             return {
//               code: jsxRemoved,
//               map: null,
//             }
//           },
//         })

// config.build.rollupOptions.plugins.push(
//   commonJs({
//     include: ['**/node_modules/react-native/**', '**/node_modules/base64-js/**'],
//     // ignoreGlobal: true,
//     transformMixedEsModules: true,
//     defaultIsModuleExports: true,
//   }) as any
// )
