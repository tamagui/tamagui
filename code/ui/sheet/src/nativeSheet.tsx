import { YStack } from '@tamagui/stacks'
import type { FunctionComponent } from 'react'
import { useEffect, useRef } from 'react'
import { View } from 'react-native'
import { SheetProvider } from './SheetContext'
import type { SheetProps } from './types'
import { useSheetOpenState } from './useSheetOpenState'
import { useSheetProviderProps } from './useSheetProviderProps'

type SheetNativePlatforms = 'ios'

const nativeSheets: Record<SheetNativePlatforms, FunctionComponent<SheetProps> | null> = {
  ios: null,
}

export function getNativeSheet(platform: SheetNativePlatforms) {
  return nativeSheets[platform]
}

export function setupNativeSheet(
  platform: SheetNativePlatforms,
  RNIOSModal: { ModalSheetView: any; ModalSheetViewMainContent: any }
) {
  const { ModalSheetView, ModalSheetViewMainContent } = RNIOSModal

  if (platform === 'ios') {
    nativeSheets[platform] = (props: SheetProps) => {
      const state = useSheetOpenState(props)
      const providerProps = useSheetProviderProps(props, state)

      const { open, setOpen } = state
      const ref = useRef<{
        presentModal: Function
        dismissModal: Function
      }>(undefined)

      useEffect(() => {
        if (open) {
          ref.current?.presentModal()
        } else {
          ref.current?.dismissModal()
        }
      }, [open])

      function setOpenInternal(next: boolean) {
        props.onOpenChange?.(open)
        setOpen(next)
      }

      return (
        <>
          <SheetProvider
            setHasScrollView={emptyFn}
            keyboardOccludedHeight={0}
            isKeyboardVisible={false}
            keyboardStableFrameHeight={0}
            {...providerProps}
            onlyShowContainer
          >
            <ModalSheetView ref={ref} onModalDidDismiss={() => setOpenInternal(false)}>
              <ModalSheetViewMainContent>
                <View style={{ flex: 1 }}>{props.children}</View>
              </ModalSheetViewMainContent>
            </ModalSheetView>

            {/* for some reason select triggers wont show on native if this isn't inside the actual tree not inside implementation... */}
            {/* so just hiding it here for now... not great... */}
            <YStack
              position="absolute"
              display="none"
              pointerEvents="none"
              width={0}
              height={0}
            >
              {props.children}
            </YStack>
          </SheetProvider>
        </>
      )
    }
  }
}

const emptyFn = () => {
  // TODO
}
