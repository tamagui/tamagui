import * as React from 'react'
import { YStack } from '@tamagui/stacks'

import { View } from 'react-native'

import { SheetProvider } from './SheetContext'
import type { SheetProps } from './types'
import { useSheetOpenState } from './useSheetOpenState'
import { useSheetProviderProps } from './useSheetProviderProps'

// import { useSheetSnapPoints } from './useSheetSnapPoints'

type SheetNativePlatforms = 'ios'

const nativeSheets: Record<SheetNativePlatforms, FunctionComponent<SheetProps> | null> = {
  ios: null,
}

export function getNativeSheet(platform: SheetNativePlatforms) {
  return nativeSheets[platform]
}

export function setupNativeSheet(platform: SheetNativePlatforms, Implementation: any) {
  if (platform === 'ios') {
    nativeSheets[platform] = (props: SheetProps) => {
      const state = useSheetOpenState(props)
      const providerProps = useSheetProviderProps(props, state)
      // const { position } = providerProps
      // const { positions } = useSheetSnapPoints(providerProps)

      const { open, setOpen } = state
      const ref = React.useRef<{
        setVisibility: Function
      }>()

      React.useEffect(() => {
        ref.current?.setVisibility(open)
      }, [open])

      // modalContentPreferredContentSize={{
      //   mode: 'percent',
      //   percentWidth: '100%',
      //   percentHeight:
      // }}

      return (
        <>
          <SheetProvider {...providerProps} onlyShowFrame>
            <Implementation ref={ref} onModalDismiss={() => setOpen(false)}>
              <View style={{ flex: 1 }}>{props.children}</View>
            </Implementation>

            {/* for some reason select triggers wont show on native if this isn't inside the actual tree not inside implementation... */}
            {/* so just hiding it here for now... not great... */}
            <YStack
              position="absolute"
              opacity={0}
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
