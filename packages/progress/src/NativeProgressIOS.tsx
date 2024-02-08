import { styled } from '@tamagui/core'
import { requireNativeViewManager } from 'expo-modules-core'
import * as React from 'react'
import { Platform } from 'react-native'

const NativeView: React.ComponentType<any> | null =
  Platform.OS === 'ios' ? requireNativeViewManager('Progress') : null

function ProgressWrapper({ max, ...restProps }: { max?: number }) {
  if (!NativeView) return null
  return <NativeView max={max ?? 1} {...restProps} />
}

export const Progress = styled(ProgressWrapper, {})

// @ts-ignore
Progress.Indicator = (props: any) => null
