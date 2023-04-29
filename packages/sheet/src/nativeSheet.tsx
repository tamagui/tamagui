import { FunctionComponent, useEffect, useRef } from 'react'

import { SheetProvider } from './SheetContext'
import { SheetProps } from './types'
import { useSheetOpenState } from './useSheetOpenState'
import { useSheetProviderProps } from './useSheetProviderProps'

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
      const { open, setOpen } = state
      const ref = useRef<{
        setVisibility: Function
      }>()

      useEffect(() => {
        ref.current?.setVisibility(open)
      }, [open])

      console.log('Implementation', Implementation)

      return (
        <Implementation ref={ref} onModalDismiss={() => setOpen(false)}>
          <SheetProvider {...providerProps}>{props.children}</SheetProvider>
        </Implementation>
      )
    }
  }
}
