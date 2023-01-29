import { readFile } from 'fs/promises'
import { join } from 'path'

import { esbuildFlowPlugin } from '@bunchtogether/vite-plugin-flow'
import { OutputOptions } from 'rollup'
import type { Plugin } from 'vite'

import { extensions } from './extensions.js'

export function nativePlugin(): Plugin {
  return {
    name: 'tamagui-native',
    enforce: 'post',

    config: (config) => {
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

      config.resolve.alias ??= {}
      config.resolve.alias = {
        ...config.resolve.alias,
        'react-native/Libraries/Renderer/shims/ReactFabric':
          'react-native/Libraries/Renderer/shims/ReactFabric',
        'react-native/Libraries/Utilities/codegenNativeComponent':
          'react-native/Libraries/Utilities/codegenNativeComponent',
        'react-native-svg': 'react-native-svg',
        'react-native-web': 'react-native',
        'react-native': 'react-native',
      }

      config.optimizeDeps ??= {}
      config.optimizeDeps.esbuildOptions ??= {}
      config.optimizeDeps.esbuildOptions.resolveExtensions = extensions

      config.optimizeDeps.esbuildOptions.plugins ??= []
      config.optimizeDeps.esbuildOptions.plugins.push(
        esbuildFlowPlugin(
          /node_modules\/(react-native\/|@react-native\/assets)/,
          (_) => 'jsx'
        )
      )
      // config.optimizeDeps.esbuildOptions.plugins.push(esbuildCommonjs(['react-native']))

      config.optimizeDeps.include ??= []
      config.optimizeDeps.include.push('react-native')

      config.optimizeDeps.esbuildOptions.loader ??= {}
      config.optimizeDeps.esbuildOptions.loader['.js'] = 'jsx'

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

      config.build.rollupOptions.input =
        '/Users/n8/tamagui/apps/kitchen-sink/src/index.tsx'

      config.build.rollupOptions.output ??= {}

      config.build.rollupOptions.plugins ??= []

      config.build.rollupOptions.external = ['react-native', 'react', 'react/jsx-runtime']

      if (!Array.isArray(config.build.rollupOptions.plugins)) {
        throw `x`
      }

      if (process.env.DEBUG) {
        console.log('config..', config)
      }

      config.build.commonjsOptions = {
        include: /node_modules\/react\//,
      }

      config.build.rollupOptions.plugins.push({
        name: `swap-react-native`,
        async load(id) {
          if (id.endsWith('react-native/index.js')) {
            const bundled = await readFile(
              join(process.cwd(), 'react-native.js'),
              'utf-8'
            )
            const code = bundled
            return {
              code: `
const run = () => {  
  ${bundled.replace(
    `module.exports = require_react_native();`,
    `return require_react_native();`
  )}
}

const RN = run()

${RNExportNames.map(
  (name) =>
    // adding exports
    `export const ${name} = RN.${name}`
).join('\n')}

`,
            }
          }
        },
      })

      const updateOutputOptions = (out: OutputOptions) => {
        // Ensure that as many resources as possible are inlined.
        out.inlineDynamicImports = true

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
  'DatePickerIOS',
  'DrawerLayoutAndroid',
  'FlatList',
  'Image',
  'ImageBackground',
  'InputAccessoryView',
  'KeyboardAvoidingView',
  'MaskedViewIOS',
  'Modal',
  'Pressable',
  'ProgressBarAndroid',
  'ProgressViewIOS',
  'RefreshControl',
  'SafeAreaView',
  'ScrollView',
  'SectionList',
  'Slider',
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
  'AsyncStorage',
  'BackHandler',
  'Clipboard',
  'DeviceInfo',
  'DevSettings',
  'Dimensions',
  'Easing',
  'findNodeHandle',
  'I18nManager',
  'ImagePickerIOS',
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
