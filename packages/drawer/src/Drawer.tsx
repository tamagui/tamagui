import { BottomSheetModal, BottomSheetModalProps } from '@gorhom/bottom-sheet'
import { Stack, useTheme, withStaticProperties } from '@tamagui/core'
import React from 'react'
import { useEffect, useRef } from 'react'

import { DrawerProvider } from './DrawerProvider'

export const Drawer = withStaticProperties(
  ({
    children,
    open,
    onChange,
    showHandle,
    hideBackground,
    ...props
  }: Omit<Partial<BottomSheetModalProps>, 'onChange'> & {
    open?: boolean
    onChange?: ((showing: boolean) => void) | React.Dispatch<React.SetStateAction<boolean>>
    showHandle?: boolean
    hideBackground?: boolean
  }) => {
    const sheetRef = useRef<BottomSheetModal>(null)
    const theme = useTheme()

    useEffect(() => {
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
        backgroundStyle={{
          backgroundColor: theme.bg?.toString(),
          shadowColor: theme.shadowColor?.toString(),
          shadowRadius: 10,
        }}
        snapPoints={['40%']}
        ref={sheetRef}
        {...(!!onChange && {
          onChange: (i) => {
            onChange(i === 0)
          },
        })}
        {...props}
      >
        {hideBackground ? null : (
          <Stack
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            backgroundColor="$bg"
            borderTopLeftRadius="$2"
            borderTopRightRadius="$2"
          >
            {children}
          </Stack>
        )}
      </BottomSheetModal>
    )
  },
  {
    Provider: DrawerProvider,
  }
)
