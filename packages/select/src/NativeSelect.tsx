import { styled } from '@tamagui/core'
import { requireNativeViewManager } from 'expo-modules-core'
import * as React from 'react'
import { Platform } from 'react-native'

import { SelectItem } from './SelectItem'
import { SelectItemText } from './SelectItemText'
import { SelectProps } from './types'

const NativeSelectView: React.ComponentType<any> | null =
  Platform.OS === 'ios' ? requireNativeViewManager('TamaguiSelect') : null

function NativeSelectWrapper({
  children,
  onValueChange,
  nativeType,
  ...restProps
}: SelectProps & {
  nativeType?: 'menu' | 'wheel'
}) {
  if (!NativeSelectView) return null
  const items = getSelectItemChildren(children)
  const itemTexts = getSelectItemTextChildren(children)
  const options = items.map((item, index) => ({
    label: itemTexts[index],
    value: item,
  }))

  return (
    <NativeSelectView
      options={options}
      type={nativeType}
      onValueChange={(e) => {
        onValueChange?.(e.nativeEvent.value)
      }}
      {...restProps}
    />
  )
}

export const NativeSelect = styled(NativeSelectWrapper, {
  width: 200,
  height: 40,
})

const getSelectItemChildren = (children: React.ReactNode) => {
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === SelectItem) {
        if (child.props.children) {
          return child.props.value
        }
      }
      return getSelectItemChildren(child.props.children)
    }
    return null
  })
}

const getSelectItemTextChildren = (children: React.ReactNode) => {
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === SelectItemText) {
        return child.props.children
      }
      return getSelectItemTextChildren(child.props.children)
    }
    return null
  })
}
