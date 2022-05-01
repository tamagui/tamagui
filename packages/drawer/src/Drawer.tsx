import { BottomSheetModal, BottomSheetModalProps } from '@gorhom/bottom-sheet'
import {
  ThemeName,
  getVariableValue,
  styled,
  themeable,
  useTheme,
  withStaticProperties,
} from '@tamagui/core'
import { YStack } from '@tamagui/stacks'
import React, { useLayoutEffect } from 'react'
import { useEffect, useRef } from 'react'

import { DrawerProvider } from './DrawerProvider'

const DrawerPanel = styled(YStack, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: '$background',
  borderTopLeftRadius: '$4',
  borderTopRightRadius: '$4',
})

export const Drawer = withStaticProperties(
  themeable(
    ({
      children,
      open,
      onChange,
      showHandle,
      hideBackground,
      backgroundStyle,
      ...props
    }: Omit<Partial<BottomSheetModalProps>, 'onChange'> & {
      theme?: ThemeName
      open?: boolean
      onChange?: ((showing: boolean) => void) | React.Dispatch<React.SetStateAction<boolean>>
      showHandle?: boolean
      hideBackground?: boolean
    }) => {
      const sheetRef = useRef<BottomSheetModal>(null)
      const theme = useTheme()

      useLayoutEffect(() => {
        if (!open) {
          sheetRef.current?.dismiss()
        } else {
          sheetRef.current?.present()
        }
      }, [open])

      return (
        <BottomSheetModal
          {...(!showHandle && {
            handleComponent: null,
          })}
          snapPoints={['80%']}
          ref={sheetRef}
          {...(!!onChange && {
            onChange: (i) => {
              onChange(i === 0)
            },
          })}
          {...props}
          backgroundStyle={[
            {
              backgroundColor: getVariableValue(theme.background),
              shadowColor: getVariableValue(theme.shadowColor),
              shadowRadius: 10,
            },
            backgroundStyle,
          ]}
        >
          {hideBackground ? null : <DrawerPanel>{children}</DrawerPanel>}
        </BottomSheetModal>
      )
    },
    {
      componentName: 'Drawer',
    }
  ),
  {
    Provider: DrawerProvider,
    Panel: DrawerPanel,
  }
)
