process.env.TAMAGUI_TARGET = 'native'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { createStyledHOC, TamaguiProvider, View, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react-native'
import { expect, test } from 'vitest'

// regression: themeable() passes data-disable-theme to the inner component of
// every styled HOC. on native that flag must be IGNORED because honoring it
// skips the theme subscription, and since components are React.memo'd nothing
// re-renders the leaf on theme change, leaving resolved token colors stale.
// (web is safe via CSS variables.) guards the native branch of disableThemeProp
// in createComponent.

const config = createTamagui(getDefaultTamaguiConfig('native'))

const Custom = createStyledHOC(View)((props, ref) => <View ref={ref} {...props} />)

const findBg = (node: any): any => {
  if (!node) return undefined
  const styles = Array.isArray(node.props?.style) ? node.props.style : [node.props?.style]
  for (const s of styles.flat(Infinity)) {
    if (s && s.backgroundColor) return s.backgroundColor
  }
  for (const child of node.children || []) {
    const found = findBg(child)
    if (found) return found
  }
  return undefined
}

test('styled HOC leaf updates token color on theme switch (native)', () => {
  const ui = (theme: string) => (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <Custom backgroundColor="$color" width={10} height={10} />
    </TamaguiProvider>
  )
  const { rerender, toJSON } = render(ui('light'))
  const before = findBg(toJSON())
  rerender(ui('dark'))
  const after = findBg(toJSON())
  expect(before).toBeTruthy()
  expect(after).toBeTruthy()
  expect(after).not.toBe(before)
})
