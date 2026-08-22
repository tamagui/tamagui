// @ts-nocheck -- generated compiler fixture
/**
 * Tests the native compiler's conservative bailout for ternaries that mix theme
 * tokens with non-token values. Static compiler coverage owns the lowering
 * decision; Detox verifies that the bailout matches the explicit runtime path.
 */

import { useState } from 'react'
import { Text, YStack } from 'tamagui'
import { Button } from '../components/Button'

function ActiveText({ isActive, label }: { isActive: boolean; label: string }) {
  return (
    <YStack
      testID="opt-color-box"
      backgroundColor={`${isActive ? 'color11' : 'color10'}`}
      height={60}
      justifyContent="center"
      alignItems="center"
    >
      <Text
        testID="active-text"
        fontSize="3"
        fontWeight={isActive ? '700' : '400'}
        color={`${isActive ? 'color11' : 'color10'}`}
      >
        {label}
      </Text>
    </YStack>
  )
}

function ActiveTextNoOpt({ isActive, label }: { isActive: boolean; label: string }) {
  return (
    <YStack
      disableOptimization
      testID="noopt-color-box"
      backgroundColor={`${isActive ? 'color11' : 'color10'}`}
      height={60}
      justifyContent="center"
      alignItems="center"
    >
      <Text
        disableOptimization
        testID="active-text-noopt"
        fontSize="3"
        fontWeight={isActive ? '700' : '400'}
        color={`${isActive ? 'color11' : 'color10'}`}
      >
        {label}
      </Text>
    </YStack>
  )
}

export function CompilerTernaryActive() {
  const [isActive, setIsActive] = useState(false)

  return (
    <__TamaguiStableView1532 testID="compiler-ternary-active-root">
      <__TamaguiStableText1678 testID="active-state-label">
        Active: {isActive ? 'YES' : 'NO'}
      </__TamaguiStableText1678>

      <Button size="3" testID="toggle-active" onPress={() => setIsActive((a) => !a)}>
        Toggle Active
      </Button>

      <__TamaguiNativeView
        style={__TamaguiNativeStyle1914._ ?? __TamaguiNativeStyle1914()}
      >
        <__TamaguiStableText1939>Compiler path:</__TamaguiStableText1939>
        <ActiveText isActive={isActive} label="Hello World" />
      </__TamaguiNativeView>

      <__TamaguiNativeView
        style={__TamaguiNativeStyle2066._ ?? __TamaguiNativeStyle2066()}
      >
        <__TamaguiStableText2091>Explicit runtime:</__TamaguiStableText2091>
        <ActiveTextNoOpt isActive={isActive} label="Hello World" />
      </__TamaguiNativeView>
    </__TamaguiStableView1532>
  )
}

function __TamaguiNativeStyle1532() {
  return (
    __TamaguiNativeStyle1532._ ??
    (__TamaguiNativeStyle1532._ = {
      flexDirection: 'column',
      flex: 1,
      paddingTop: 16,
      paddingRight: 16,
      paddingBottom: 16,
      paddingLeft: 16,
      gap: 16,
    })
  )
}
__TamaguiNativeStyle1532()
const __TamaguiNativeView = require('react-native').View
const __TamaguiStableView1532 = require('@tamagui/core')._withStableStyle(
  __TamaguiNativeView,
  (_theme, expressions) => [
    __TamaguiNativeStyle1532._ ?? __TamaguiNativeStyle1532(),
    { backgroundColor: _theme['background']?.get() },
  ],
  true,
  false
)
function __TamaguiNativeStyle1678() {
  return __TamaguiNativeStyle1678._ ?? (__TamaguiNativeStyle1678._ = { fontSize: 14 })
}
__TamaguiNativeStyle1678()
const __TamaguiNativeText = require('react-native').Text
const __TamaguiStableText1678 = require('@tamagui/core')._withStableStyle(
  __TamaguiNativeText,
  (_theme, expressions) => [
    __TamaguiNativeStyle1678._ ?? __TamaguiNativeStyle1678(),
    { color: _theme['color']?.get() },
  ],
  true,
  false
)
function __TamaguiNativeStyle1914() {
  return (
    __TamaguiNativeStyle1914._ ??
    (__TamaguiNativeStyle1914._ = { flexDirection: 'column', gap: 8 })
  )
}
__TamaguiNativeStyle1914()
function __TamaguiNativeStyle1939() {
  return __TamaguiNativeStyle1939._ ?? (__TamaguiNativeStyle1939._ = { fontSize: 13 })
}
__TamaguiNativeStyle1939()
const __TamaguiStableText1939 = require('@tamagui/core')._withStableStyle(
  __TamaguiNativeText,
  (_theme, expressions) => [
    __TamaguiNativeStyle1939._ ?? __TamaguiNativeStyle1939(),
    { color: _theme['color']?.get() },
  ],
  true,
  false
)
function __TamaguiNativeStyle2066() {
  return (
    __TamaguiNativeStyle2066._ ??
    (__TamaguiNativeStyle2066._ = { flexDirection: 'column', gap: 8 })
  )
}
__TamaguiNativeStyle2066()
function __TamaguiNativeStyle2091() {
  return __TamaguiNativeStyle2091._ ?? (__TamaguiNativeStyle2091._ = { fontSize: 13 })
}
__TamaguiNativeStyle2091()
const __TamaguiStableText2091 = require('@tamagui/core')._withStableStyle(
  __TamaguiNativeText,
  (_theme, expressions) => [
    __TamaguiNativeStyle2091._ ?? __TamaguiNativeStyle2091(),
    { color: _theme['color']?.get() },
  ],
  true,
  false
)
