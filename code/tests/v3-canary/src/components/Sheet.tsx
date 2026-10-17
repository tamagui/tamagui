import { Sheet as SheetBehavior, type SheetProps } from '@tamagui/sheet'
import { createRefComponent, styled, type GetRef, withStaticProperties } from 'tamagui'

export const SheetHandle = styled(SheetBehavior.Handle, {
  displayName: 'CanarySheetHandle',
  bg: 'canary-token',
  rounded: 1000,
  h: 10,
  mb: '2',
  mx: '35%',
  z: 10,
  // Handle opacity aesthetics live in the skin, not the behavior package.
  opacity: '0.5 hover:0.7',
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
  displayName: 'CanarySheetOverlay',
  bg: 'black',
  opacity: 0.45,
})

export const SheetContainer = styled(SheetBehavior.Container, {
  displayName: 'CanarySheetContainer',
  p: '5',
})

export const SheetBackground = styled(SheetBehavior.Background, {
  displayName: 'CanarySheetBackground',
  bg: 'background',
  borderTopLeftRadius: '6',
  borderTopRightRadius: '6',
})

export const SheetScrollView = styled(SheetBehavior.ScrollView, {
  displayName: 'CanarySheetScrollView',
  flex: 1,
  px: '2',
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
