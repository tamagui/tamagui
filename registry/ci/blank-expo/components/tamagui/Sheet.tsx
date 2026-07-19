// Styled Sheet = the unstyled @tamagui/ui Sheet behavior primitive + the
// default v2-look skin, layered here in `tamagui`. Single skin definition; the
// shadcn registry item is generated from this file.
import {
  createRefComponent,
  type GetProps,
  type GetRef,
  Sheet as SheetBehavior,
  type SheetProps,
  styled,
  useSheetContext,
  withStaticProperties,
} from '@tamagui/ui'

const SheetHandleFrame = styled(SheetBehavior.Handle, {
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

// The behavior forwards `open` to its inner handle frame, not to this styled
// wrapper, so read the sheet context here and forward `open` — otherwise the
// open-opacity variant above never toggles.
export const SheetHandle = createRefComponent<
  GetRef<typeof SheetHandleFrame>,
  GetProps<typeof SheetHandleFrame>
>(function SheetHandle(props, ref) {
  const context = useSheetContext((props as any).scope)
  return <SheetHandleFrame ref={ref} {...props} open={context.open} />
})

export const SheetOverlay = styled(SheetBehavior.Overlay, {
  name: 'SheetOverlay',
  backgroundColor: '$shadowColor',
  opacity: 0.45,
})

export const SheetContainer = styled(SheetBehavior.Container, {
  name: 'SheetContainer',
  // no padding on the Container: the keyboard-avoidance measures this frame, and
  // in snapPointsMode="fit" any vertical padding here inflates the frame beyond
  // the preserved fit height, so the keyboard lift is off by exactly the padding
  // (SheetWebKeyboard geometry). Content inset comes from the ScrollView skin +
  // the consumer's own content padding, matching the pre-skin baseline.
})

export const SheetBackground = styled(SheetBehavior.Background, {
  name: 'SheetBackground',
  backgroundColor: '$background',
  borderTopLeftRadius: '$6',
  borderTopRightRadius: '$6',
})

export const SheetScrollView = styled(SheetBehavior.ScrollView, {
  name: 'SheetScrollView',
  // no flex here: the behavior's fitSizingStyle sets flex per mode (undefined for
  // snapPointsMode="fit" so the content-sized Container doesn't collapse, 1
  // otherwise), and consumer props apply AFTER that guard — a skin-level flex:1
  // would override it and collapse the fit-mode scrollview (SheetWebKeyboard).
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
