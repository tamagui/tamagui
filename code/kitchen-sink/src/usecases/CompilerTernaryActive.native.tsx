const __ReactNativeStyleSheet = require('react-native').StyleSheet
const _sheet = __ReactNativeStyleSheet.create({
  '0': {
    flexDirection: 'column',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  '1': {
    fontSize: 13,
  },
  '2': {
    fontWeight: '700',
  },
  '3': {
    fontWeight: '400',
  },
  '4': {
    flexDirection: 'column',
    flex: 1,
    paddingTop: 18,
    paddingRight: 18,
    paddingBottom: 18,
    paddingLeft: 18,
    gap: 18,
  },
  '5': {
    fontSize: 13,
  },
  '6': {
    flexDirection: 'column',
    gap: 7,
  },
  '7': {
    fontSize: 12,
  },
  '8': {
    flexDirection: 'column',
    gap: 7,
  },
  '9': {
    fontSize: 12,
  },
})
import { _withStableStyle } from '@tamagui/core'
const __ReactNativeView = require('react-native').View
const __ReactNativeText = require('react-native').Text
/**
 * Tests compiler extraction of ternaries mixing theme-token and non-token values.
 * Regression test for bug where fontWeight ternary was dropped when combined
 * with a theme-token color ternary on native.
 *
 * The compiler's extractToNative was unconditionally adding plain styles
 * (fontWeight) from ternary branches instead of wrapping them in the conditional.
 */

import { useState } from 'react'
import { Button, Text, YStack } from 'tamagui'
function ActiveText({ isActive, label }: { isActive: boolean; label: string }) {
  return (
    <_ReactNativeViewStyled0 testID={'opt-color-box'} _expressions={[isActive]}>
      <_ReactNativeTextStyled1 testID={'active-text'} _expressions={[isActive]}>
        {label}
      </_ReactNativeTextStyled1>
    </_ReactNativeViewStyled0>
  )
}
function ActiveTextNoOpt({ isActive, label }: { isActive: boolean; label: string }) {
  return (
    <YStack
      disableOptimization
      testID="noopt-color-box"
      backgroundColor={isActive ? '$color12' : '$color11'}
      height={60}
      justifyContent="center"
      alignItems="center"
    >
      <Text
        disableOptimization
        testID="active-text-noopt"
        fontSize="$3"
        fontWeight={isActive ? '700' : '400'}
        color={isActive ? '$color12' : '$color11'}
      >
        {label}
      </Text>
    </YStack>
  )
}
export function CompilerTernaryActive() {
  const [isActive, setIsActive] = useState(false)
  return (
    <_ReactNativeViewStyled2 testID={'compiler-ternary-active-root'}>
      <_ReactNativeTextStyled3 testID={'active-state-label'}>
        Active: {isActive ? 'YES' : 'NO'}
      </_ReactNativeTextStyled3>

      <Button size="$2" testID="toggle-active" onPress={() => setIsActive((a) => !a)}>
        Toggle Active
      </Button>

      <__ReactNativeView style={_sheet['6']}>
        <_ReactNativeTextStyled4>Optimized:</_ReactNativeTextStyled4>
        <ActiveText isActive={isActive} label="Hello World" />
      </__ReactNativeView>

      <__ReactNativeView style={_sheet['8']}>
        <_ReactNativeTextStyled5>Non-optimized:</_ReactNativeTextStyled5>
        <ActiveTextNoOpt isActive={isActive} label="Hello World" />
      </__ReactNativeView>
    </_ReactNativeViewStyled2>
  )
}
const _ReactNativeViewStyled0 = _withStableStyle(
  __ReactNativeView,
  (theme, _expressions) => [
    _sheet['0'],
    _expressions[0]
      ? {
          backgroundColor: theme.color12.get(),
        }
      : {
          backgroundColor: theme.color11.get(),
        },
  ],
  true,
  false
)
const _ReactNativeTextStyled1 = _withStableStyle(
  __ReactNativeText,
  (theme, _expressions) => [
    _sheet['1'],
    {
      color: theme.color.get(),
    },
    _expressions[0]
      ? [
          _sheet['2'],
          {
            color: theme.color12.get(),
          },
        ]
      : [
          _sheet['3'],
          {
            color: theme.color11.get(),
          },
        ],
  ],
  true,
  false
)
const _ReactNativeViewStyled2 = _withStableStyle(
  __ReactNativeView,
  (theme, _expressions) => [
    _sheet['4'],
    {
      backgroundColor: theme.background.get(),
    },
  ],
  true,
  false
)
const _ReactNativeTextStyled3 = _withStableStyle(
  __ReactNativeText,
  (theme, _expressions) => [
    _sheet['5'],
    {
      color: theme.color.get(),
    },
  ],
  true,
  false
)
const _ReactNativeTextStyled4 = _withStableStyle(
  __ReactNativeText,
  (theme, _expressions) => [
    _sheet['7'],
    {
      color: theme.color.get(),
    },
  ],
  true,
  false
)
const _ReactNativeTextStyled5 = _withStableStyle(
  __ReactNativeText,
  (theme, _expressions) => [
    _sheet['9'],
    {
      color: theme.color.get(),
    },
  ],
  true,
  false
)
