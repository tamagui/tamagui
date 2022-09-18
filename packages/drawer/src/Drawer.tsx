import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetSectionList,
  BottomSheetVirtualizedList,
} from '@gorhom/bottom-sheet'
import { composeRefs } from '@tamagui/compose-refs'
import {
  styled,
  themeable,
  useIsSSR,
  useIsomorphicLayoutEffect,
  withStaticProperties,
} from '@tamagui/core'
import { ScopedProps, createContextScope } from '@tamagui/create-context'
import { XStack, YStack } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import React, { ReactNode, forwardRef, isValidElement, useRef } from 'react'

type OpenChangeHandler =
  | ((showing: boolean) => void)
  | React.Dispatch<React.SetStateAction<boolean>>

export const DrawerProvider = BottomSheetModalProvider

const DRAWER_NAME = 'Drawer'

export const DrawerHandle = styled(XStack, {
  name: 'DrawerHandle',
  height: 8,
  borderRadius: 100,
  backgroundColor: '$backgroundHover',
  position: 'absolute',
  pointerEvents: 'auto',
  zIndex: 10,
  y: -20,
  top: 0,
  left: '30%',
  right: '30%',
  opacity: 0.5,

  hoverStyle: {
    opacity: 0.7,
  },
})

type DrawerContextValue = {
  open?: boolean
  onOpenChange?: OpenChangeHandler
  backgroundComponent?: any
  handleComponent?: any
}

const [createDrawerContext, createDrawerScope] = createContextScope(DRAWER_NAME)
const [DrawerRootProvider, useDrawerContext] = createDrawerContext<DrawerContextValue>(
  DRAWER_NAME,
  {}
)

export const DrawerBackdrop = styled(YStack, {
  name: 'DrawerBackdrop',
  backgroundColor: '$color',
  fullscreen: true,
  opacity: 0.2,
})

export const DrawerFrame = styled(YStack, {
  name: 'DrawerFrame',
  flex: 1,
  backgroundColor: '$background',
  borderTopLeftRadius: '$4',
  borderTopRightRadius: '$4',
  padding: '$4',
})

export type DrawerProps = ScopedProps<
  Omit<Partial<BottomSheetModalProps>, 'onChange' | 'backgroundStyle' | 'style'>,
  'Drawer'
> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: OpenChangeHandler
  children?: ReactNode
}

export const Drawer = withStaticProperties(
  themeable(
    forwardRef<BottomSheetModal, DrawerProps>((props, ref) => {
      const {
        __scopeDrawer,
        children: childrenProp,
        open: openProp,
        defaultOpen,
        onOpenChange,
        ...rest
      } = props
      const isServerSide = useIsSSR()
      const [open, setOpen] = useControllableState({
        prop: openProp,
        defaultProp: defaultOpen || false,
        onChange: onOpenChange,
        strategy: 'most-recent-wins',
      })
      const sheetRef = useRef<BottomSheetModal>(null)

      useIsomorphicLayoutEffect(() => {
        if (!open) {
          // bugfix
          const tm = setTimeout(() => {
            sheetRef.current?.dismiss()
          })

          return () => {
            clearTimeout(tm)
          }
        } else {
          sheetRef.current?.present()
        }
      }, [open])

      if (isServerSide) {
        return null
      }

      let handleComponent: any = null
      let backdropComponent: any = null
      let frameComponent: any = null

      React.Children.forEach(childrenProp, (child) => {
        if (isValidElement(child)) {
          switch (child.type?.['staticConfig'].componentName) {
            case 'DrawerHandle':
              handleComponent = child
              break
            case 'DrawerFrame':
              frameComponent = child
              break
            case 'DrawerBackdrop':
              backdropComponent = child
              break
            default:
              console.warn('Warning: passed invalid child to Drawer', child)
          }
        }
      })

      return (
        <DrawerRootProvider scope={__scopeDrawer} open={open} onOpenChange={setOpen}>
          <BottomSheetModal
            handleComponent={() => handleComponent}
            backdropComponent={() => backdropComponent}
            snapPoints={['80%']}
            ref={composeRefs(ref, sheetRef)}
            onChange={(i) => {
              const isOpen = i >= 0
              setOpen(isOpen)
            }}
            backgroundStyle={{
              backgroundColor: 'transparent',
            }}
            {...rest}
          >
            {frameComponent}
          </BottomSheetModal>
        </DrawerRootProvider>
      )
    }),
    {
      componentName: 'Drawer',
    }
  ),
  {
    Provider: DrawerProvider,
    Handle: DrawerHandle,
    Frame: DrawerFrame,
    Backdrop: DrawerBackdrop,
    ScrollView: BottomSheetScrollView,
    get FlatList() {
      return BottomSheetFlatList
    },
    get VirtualizedList() {
      return BottomSheetVirtualizedList
    },
    get SectionList() {
      return BottomSheetSectionList
    },
  }
)

export { createDrawerScope }
