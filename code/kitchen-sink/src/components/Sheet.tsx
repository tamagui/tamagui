import { Sheet as SheetBehavior, type SheetProps } from '@tamagui/sheet'
import { createRefComponent, styled, withStaticProperties, type GetRef } from 'tamagui'

export const SheetHandle = styled(SheetBehavior.Handle, {
  name: 'KitchenSinkSheetHandle',
  height: 10,
  borderRadius: 1000,
  backgroundColor: '$color5',
  zIndex: 10,
  marginHorizontal: '35%',
  marginBottom: '$2',
  opacity: 0.6,

  hoverStyle: {
    opacity: 0.85,
  },
})

export const SheetOverlay = styled(SheetBehavior.Overlay, {
  name: 'KitchenSinkSheetOverlay',
  backgroundColor: '$shadowColor',
  opacity: 0.45,
})

export const SheetContainer = styled(SheetBehavior.Container, {
  name: 'KitchenSinkSheetContainer',
  padding: '$5',
})

export const SheetBackground = styled(SheetBehavior.Background, {
  name: 'KitchenSinkSheetBackground',
  backgroundColor: '$background',
  borderTopLeftRadius: '$6',
  borderTopRightRadius: '$6',
})

export const SheetScrollView = styled(SheetBehavior.ScrollView, {
  name: 'KitchenSinkSheetScrollView',
  flex: 1,
  paddingHorizontal: '$2',
})

const sheetParts = {
  Container: SheetContainer,
  Background: SheetBackground,
  Overlay: SheetOverlay,
  Handle: SheetHandle,
  ScrollView: SheetScrollView,
}

type SheetRef = GetRef<typeof SheetBehavior.Root>

export const SheetRoot = createRefComponent<SheetRef, SheetProps>(
  function KitchenSinkSheetRoot(props, ref) {
    return <SheetBehavior.Root ref={ref} {...props} />
  }
)

const SheetControlledRoot = createRefComponent<
  SheetRef,
  Omit<SheetProps, 'open' | 'onOpenChange'>
>(function KitchenSinkSheetControlled(props, ref) {
  return <SheetBehavior.Controlled ref={ref} {...props} />
})

export const SheetControlled = withStaticProperties(SheetControlledRoot, sheetParts)

export const Sheet = withStaticProperties(SheetRoot, {
  Root: SheetRoot,
  Controlled: SheetControlled,
  ...sheetParts,
})
