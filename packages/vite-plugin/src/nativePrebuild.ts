import { readFile } from 'fs/promises'
import { join } from 'path'

import * as babel from '@babel/core'
import { build } from 'esbuild'
import { writeFile } from 'fs-extra'

import { extensions } from './extensions'

async function nativeBabelFlowTransform(input: string) {
  return await new Promise<string>((res, rej) => {
    babel.transform(
      input,
      {
        presets: ['module:metro-react-native-babel-preset'],
      },
      (err: any, { code }) => {
        if (err) rej(err)
        res(code)
      }
    )
  })
}

const prebuiltDir = join(process.cwd(), 'testing-area')
export const prebuiltFiles = {
  react: join(prebuiltDir, 'react.js'),
  reactJSXRuntime: join(prebuiltDir, 'react-jsx-runtime.js'),
  reactNative: join(prebuiltDir, 'react-native.js'),
}

export async function nativePrebuild() {
  // rome-ignore lint/suspicious/noConsoleLog: <explanation>

  // await build({
  //   bundle: true,
  //   entryPoints: [require.resolve('@tamagui/core')],
  //   outfile: prebuiltFiles.reactNative,
  //   format: 'cjs',
  //   target: 'node20',
  //   jsx: 'transform',
  //   jsxFactory: 'react',
  //   allowOverwrite: true,
  //   platform: 'node',
  //   external: ['react-native', 'react', 'react/jsx-runtime'],
  //   loader: {
  //     '.png': 'dataurl',
  //     '.jpg': 'dataurl',
  //     '.jpeg': 'dataurl',
  //     '.gif': 'dataurl',
  //   },
  //   define: {
  //     __DEV__: 'true',
  //     'process.env.NODE_ENV': `"development"`,
  //     // TODO
  //     'process.env.REACT_NATIVE_SERVER_PUBLIC_PORT': JSON.stringify('8081'),
  //   },
  //   logLevel: 'warning',
  //   resolveExtensions: extensions,
  // })

  if (process.env.SKIP_PREBUILD_RN) {
    return
  }

  // rome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log(`Prebuilding React Native (one time cost...)`)

  await build({
    bundle: true,
    entryPoints: [require.resolve('react-native')],
    outfile: prebuiltFiles.reactNative,
    format: 'cjs',
    target: 'node20',
    jsx: 'transform',
    jsxFactory: 'react',
    allowOverwrite: true,
    platform: 'node',
    loader: {
      '.png': 'dataurl',
      '.jpg': 'dataurl',
      '.jpeg': 'dataurl',
      '.gif': 'dataurl',
    },
    define: {
      __DEV__: 'true',
      'process.env.NODE_ENV': `"development"`,
      // TODO
      'process.env.REACT_NATIVE_SERVER_PUBLIC_PORT': JSON.stringify('8081'),
    },
    logLevel: 'warning',
    resolveExtensions: extensions,
    plugins: [
      {
        name: 'remove-flow',
        setup(build) {
          build.onResolve(
            {
              filter: /HMRClient/,
            },
            async (input) => {
              return {
                path: require.resolve('@tamagui/vite-native-hmr'),
              }
            }
          )

          build.onLoad(
            {
              filter: /.*.js/,
            },
            async (input) => {
              if (
                !input.path.includes('react-native') &&
                !input.path.includes(`vite-native-hmr`)
              ) {
                return
              }

              const code = await readFile(input.path, 'utf-8')

              // omg so ugly but no class support?
              const outagain = await nativeBabelFlowTransform(code)

              return {
                contents: outagain,
                loader: 'jsx',
              }
            }
          )
        },
      },
    ],
  })

  // now make our modifications:

  const bundled = await readFile(prebuiltFiles.reactNative, 'utf-8')
  const outCode = `
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
      .replace(`var require_react = `, `var require_react = global['__React__'] = `)}
  }
  const RN = run()
  ${RNExportNames.map((n) => `export const ${n} = RN.${n}`).join('\n')}
  `

  await writeFile(prebuiltFiles.reactNative, outCode)
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
