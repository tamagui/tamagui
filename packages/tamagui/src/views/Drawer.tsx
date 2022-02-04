import {
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { useEffect, useRef } from 'react'

import { withStaticProperties } from '../helpers/withStaticProperties'
import { YStack } from './Stacks'

export const DrawerProvider = BottomSheetModalProvider

export const Drawer = withStaticProperties(
  ({
    children,
    open,
    ...props
  }: Partial<BottomSheetModalProps> & {
    open?: boolean
  }) => {
    const sheetRef = useRef<BottomSheetModal>(null)

    useEffect(() => {
      if (!open) {
        sheetRef.current?.dismiss()
      } else {
        sheetRef.current?.present()
      }
    }, [open])

    return (
      <BottomSheetModal snapPoints={[0.5]} ref={sheetRef} {...props}>
        <YStack backgroundColor="$bg" borderTopLeftRadius="$2" borderTopRightRadius="$2">
          {children}
        </YStack>
      </BottomSheetModal>
    )
  },
  {
    Provider: DrawerProvider,
  }
)
