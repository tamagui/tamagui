process.env.TAMAGUI_TARGET = 'native'

import { transform } from 'esbuild'
import * as ReactModule from 'react'
import * as JSXRuntime from 'react/jsx-runtime'
import { act, create, type ReactTestRenderer } from 'react-test-renderer'
import { expect, test, vi } from 'vitest'

import configDefault from '../../../core/config-default'
import * as Core from '../../../core/web/src'
import { extractForNative } from './lib/extract'

vi.mock('react-native', async (importOriginal) => {
  const original = await importOriginal<typeof import('react-native')>()
  const { createElement } = await import('react')
  const host = (name: string) => (props: Record<string, unknown>) =>
    createElement(name, props, props.children as any)
  return {
    ...original,
    Image: host('Image'),
    Platform: { ...original.Platform, OS: 'macos' },
    Pressable: host('Pressable'),
    Text: host('Text'),
    TextInput: host('TextInput'),
    View: host('View'),
    StyleSheet: {
      ...original.StyleSheet,
      flatten: (style: unknown) => style,
    },
    useWindowDimensions: () => ({ width: 1000, height: 800, scale: 1, fontScale: 1 }),
  }
})

vi.mock('@tamagui/constants', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tamagui/constants')>()),
  isNativeDesktop: true,
  isWeb: false,
}))

import * as ReactNative from 'react-native'

const { TamaguiProvider, Theme, createTamagui } = Core
const config = createTamagui(configDefault.getDefaultTamaguiConfig('native'))

function styleValue(node: { props: { style?: unknown } }, key: string) {
  const styles = (Array.isArray(node.props.style) ? node.props.style : [node.props.style])
    .flat(Number.POSITIVE_INFINITY)
    .filter(Boolean) as Record<string, unknown>[]
  return styles.reduce<unknown>(
    (value, style) => (key in style ? style[key] : value),
    undefined
  )
}

async function executeCompiled(source: string) {
  const output = await extractForNative(source)
  expect(output.diagnostics).toEqual([])
  const transformed = await transform(output.code, {
    format: 'cjs',
    jsx: 'automatic',
    loader: 'tsx',
    platform: 'node',
    target: 'es2021',
  })
  const compiledModule = { exports: {} as Record<string, ReactModule.ComponentType> }
  const localRequire = (specifier: string) => {
    if (specifier === 'react') return ReactModule
    if (specifier === 'react/jsx-runtime') return JSXRuntime
    if (specifier === 'react-native') return ReactNative
    if (specifier === '@tamagui/core') return Core
    // flattened output leaves the original component imports behind unused
    if (specifier === 'tamagui') {
      return new Proxy({}, { get: () => () => null })
    }
    throw new Error(`Unexpected compiled dependency: ${specifier}`)
  }
  Function(
    'require',
    'module',
    'exports',
    transformed.code
  )(localRequire, compiledModule, compiledModule.exports)
  return { exports: compiledModule.exports, code: output.code, stats: output.stats }
}

test('fully-flattened theme values read the live theme and update on theme change', async () => {
  const { exports: compiled, code } = await executeCompiled(`
    import { YStack } from 'tamagui'
    export function Test() {
      return <YStack testID="themed" bg="background" padding={8} />
    }
  `)
  // the theme-backed key is split out of the hoisted style into a live read,
  // never frozen to the build machine's first-theme literal
  expect(code).toContain('"backgroundColor": _theme["background"]?.get()')
  expect(code).not.toMatch(/"backgroundColor":\s*"/)

  const lightBackground = config.themes.light.background.val
  const darkBackground = config.themes.dark.background.val
  expect(lightBackground).not.toBe(darkBackground)

  // the extract pipeline flips TAMAGUI_TARGET while bundling configs; pin it
  // back so the runtime render below behaves like a real native bundle
  process.env.TAMAGUI_TARGET = 'native'

  const Test = compiled.Test!
  const app = (themeName: 'light' | 'dark') => (
    <TamaguiProvider config={config} defaultTheme="light">
      <Theme name={themeName}>
        <Test />
      </Theme>
    </TamaguiProvider>
  )
  let renderer: ReactTestRenderer
  act(() => {
    renderer = create(app('light'))
  })
  const view = () =>
    renderer.root.findAll((node) => node.props?.testID === 'themed').at(-1)!
  expect(styleValue(view(), 'backgroundColor')).toBe(lightBackground)
  expect(styleValue(view(), 'paddingTop')).toBe(8)

  act(() => {
    renderer.update(app('dark'))
  })
  expect(styleValue(view(), 'backgroundColor')).toBe(darkBackground)
  expect(styleValue(view(), 'paddingTop')).toBe(8)
})

test('theme values with opacity modifiers stay on the runtime path', async () => {
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    export function Test() {
      return <YStack bg="background/50" />
    }
  `)
  expect(output.stats.flattened).toBe(0)
  expect(output.diagnostics.map(({ code }) => code)).toEqual([
    'local/dynamic-style-value',
  ])
})
