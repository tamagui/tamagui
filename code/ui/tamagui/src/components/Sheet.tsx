// Styled Sheet = the unstyled @tamagui/ui Sheet behavior primitive + the
// default v2-look skin, layered here in `tamagui`. Single skin definition; the
// shadcn registry item is generated from this file.
import {
  createRefComponent,
  type GetRef,
  Sheet as SheetBehavior,
  type SheetProps,
  styled,
  withStaticProperties,
} from '@tamagui/ui'

export const SheetHandle = styled(SheetBehavior.Handle, {
  name: 'SheetHandle',
  height: 10,
  borderRadius: 1000,
  backgroundColor: '$color5',
  zIndex: 10,
  marginHorizontal: '35%',
  marginBottom: '$2',

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
  name: 'SheetOverlay',
  backgroundColor: '$shadowColor',
  opacity: 0.45,
})

export const SheetContainer = styled(SheetBehavior.Container, {
  name: 'SheetContainer',
  padding: '$5',
})

export const SheetBackground = styled(SheetBehavior.Background, {
  name: 'SheetBackground',
  backgroundColor: '$background',
  borderTopLeftRadius: '$6',
  borderTopRightRadius: '$6',
})

export const SheetScrollView = styled(SheetBehavior.ScrollView, {
  name: 'SheetScrollView',
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
  function SheetRoot(props, ref) {
    return <SheetBehavior.Root ref={ref} {...props} />
  }
)

const SheetControlledRoot = createRefComponent<
  SheetRef,
  Omit<SheetProps, 'open' | 'onOpenChange'>
>(function SheetControlled(props, ref) {
  return <SheetBehavior.Controlled ref={ref} {...props} />
})

export const SheetControlled = withStaticProperties(SheetControlledRoot, sheetParts)

export const Sheet = withStaticProperties(SheetRoot, {
  Root: SheetRoot,
  Controlled: SheetControlled,
  useAnimatedPosition: SheetBehavior.useAnimatedPosition,
  ...sheetParts,
})
