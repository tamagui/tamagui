import { Sheet as SheetBehavior, type SheetProps } from '@tamagui/sheet'
import { createRefComponent, styled, type GetRef, withStaticProperties } from 'tamagui'

export const SheetHandle = styled(SheetBehavior.Handle, {
  name: 'CanarySheetHandle',
  background: '$canary-token',
  borderRadius: 1000,
  height: 10,
  marginBottom: '$2',
  marginHorizontal: '35%',
  zIndex: 10,

  // Handle opacity aesthetics live in the skin, not the behavior package.
  opacity: 0.5,
  hoverStyle: {
    opacity: 0.7,
  },
  variants: {
    open: {
      true: {
        opacity: 1,
      },
      false: {
        opacity: 0,
      },
    },
  } as const,
})

export const SheetOverlay = styled(SheetBehavior.Overlay, {
  name: 'CanarySheetOverlay',
  background: '$black',
  opacity: 0.45,
})

export const SheetContainer = styled(SheetBehavior.Container, {
  name: 'CanarySheetContainer',
  padding: '$5',
})

export const SheetBackground = styled(SheetBehavior.Background, {
  name: 'CanarySheetBackground',
  background: '$background',
  borderTopLeftRadius: '$6',
  borderTopRightRadius: '$6',
})

export const SheetScrollView = styled(SheetBehavior.ScrollView, {
  name: 'CanarySheetScrollView',
  flex: 1,
  paddingHorizontal: '$2',
})

const sheetParts = {
  Background: SheetBackground,
  Container: SheetContainer,
  Handle: SheetHandle,
  Overlay: SheetOverlay,
  ScrollView: SheetScrollView,
}

type SheetRef = GetRef<typeof SheetBehavior.Root>

const SheetRoot = createRefComponent<SheetRef, SheetProps>(
  function CanarySheetRoot(props, ref) {
    return <SheetBehavior.Root ref={ref} {...props} />
  }
)

export const Sheet = withStaticProperties(SheetRoot, {
  Root: SheetRoot,
  useAnimatedPosition: SheetBehavior.useAnimatedPosition,
  ...sheetParts,
})
