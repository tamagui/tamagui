import { BottomSheetModal, BottomSheetModalProps } from '@gorhom/bottom-sheet'
import { useTheme } from '@tamagui/core'
import { useEffect, useRef } from 'react'

import { withStaticProperties } from '../helpers/withStaticProperties'
import { DrawerProvider } from './DrawerProvider'
import { YStack } from './Stacks'

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
          <YStack
            fullscreen
            backgroundColor="$bg"
            borderTopLeftRadius="$2"
            borderTopRightRadius="$2"
          >
            {children}
          </YStack>
        )}
      </BottomSheetModal>
    )
  },
  {
    Provider: DrawerProvider,
  }
)
