process.env.TAMAGUI_TARGET = 'native'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { createStyledHOC, TamaguiProvider, View, createTamagui, styled } from '../web/src'
import { render } from '@testing-library/react-native'
import { View as NativeView } from 'react-native'
import { expect, test } from 'vitest'

// regression: styled HOCs pass data-disable-theme to the inner component of
// every styled HOC. on native that flag must be IGNORED because honoring it
// skips the theme subscription, and since components are React.memo'd nothing
// re-renders the leaf on theme change, leaving resolved token colors stale.
// (web is safe via CSS variables.) guards the native branch of disableThemeProp
// in createComponent.

const config = createTamagui(getDefaultTamaguiConfig('native'))

const Custom = createStyledHOC(View, (props, ref) => <View ref={ref} {...props} />)

const ReplayBase = styled(View, {
  variants: {
    alpha: {
      low: { padding: 10 },
      high: { padding: 30 },
    },
    beta: {
      true: { paddingLeft: 20 },
    },
  } as const,
})

const OpaqueReplay = createStyledHOC(ReplayBase, (props, ref) => (
  <NativeView accessibilityLabel="opaque-shell">
    <ReplayBase ref={ref} testID={props.testID} />
  </NativeView>
))

const NativeReplayOuter = styled(OpaqueReplay, {
  variants: {
    outer: {
      true: {
        alpha: {
          default: 'low',
          'native:dark': 'high',
        },
      },
    },
  } as const,
})

const findStyleValue = (node: any, key: string): any => {
  if (!node) return undefined
  const styles = Array.isArray(node.props?.style) ? node.props.style : [node.props?.style]
  for (const s of styles.flat(Infinity)) {
    if (s && key in s) return s[key]
  }
  for (const child of node.children || []) {
    const found = findStyleValue(child, key)
    if (found !== undefined) return found
  }
  return undefined
}

test('styled HOC leaf updates token color on theme switch (native)', () => {
  const ui = (theme: string) => (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <Custom backgroundColor="color" width={10} height={10} />
    </TamaguiProvider>
  )
  const { rerender, toJSON } = render(ui('light'))
  const before = findStyleValue(toJSON(), 'backgroundColor')
  rerender(ui('dark'))
  const after = findStyleValue(toJSON(), 'backgroundColor')
  expect(before).toBeTruthy()
  expect(after).toBeTruthy()
  expect(after).not.toBe(before)
})

test('nested styled HOC resolves a native state-string before the host leaf', () => {
  const NativeLeaf = createStyledHOC(View, (props, ref) => (
    <NativeView ref={ref} {...props} />
  ))
  const Skin = styled(NativeLeaf, {})
  const AppSkin = styled(Skin, {
    opacity: '1 enter:0 exit:0',
  })

  const { UNSAFE_getByType } = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <AppSkin testID="leaf" />
    </TamaguiProvider>
  )

  expect(UNSAFE_getByType(NativeView).props).toMatchObject({
    style: { opacity: 1 },
  })
})

test('native replay crosses opaque output with nested platform and theme identity', () => {
  const { UNSAFE_getAllByType } = render(
    <TamaguiProvider config={config} defaultTheme="dark">
      <NativeReplayOuter
        alpha="low"
        beta
        style={{ paddingLeft: 25 }}
        outer
        testID="native-replay-leaf"
      />
    </TamaguiProvider>
  )

  const shell = UNSAFE_getAllByType(NativeView).find(
    (node) => node.props.accessibilityLabel === 'opaque-shell'
  )
  expect(shell).toBeTruthy()
  expect(findStyleValue(shell, 'paddingLeft')).toBe(30)
})
