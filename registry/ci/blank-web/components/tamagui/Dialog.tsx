// Styled Dialog = the unstyled @tamagui/ui Dialog behavior + the default v2-look
// skin on its Overlay (scrim background) and Content (background, border,
// padding, radius, elevation). The behavior frames keep only positioning +
// pointer-event bookkeeping. Single skin definition; the shadcn registry item is
// generated from this file.
//
// The opt-in `elevate` + `bordered` v2-compat variants (formerly from
// ThemeableStack) live on the unstyled DialogContent frame, so
// `<Dialog.Content elevate bordered>` keeps working; this skin only adds the
// static background/border/padding/radius.
import {
  createRefComponent,
  Dialog as UiDialog,
  styled,
  type TamaguiElement,
  withStaticProperties,
} from '@tamagui/ui'
import type * as React from 'react'

export const DialogOverlay = styled(UiDialog.Overlay, {
  name: 'DialogOverlay',
  backgroundColor: '$background',
})

export const DialogContent = styled(UiDialog.Content, {
  name: 'DialogContent',
  backgroundColor: '$background',
  borderWidth: 1,
  borderColor: '$borderColor',
  padding: true,
  borderRadius: true,
})

// `withStaticProperties` assigns onto the component it is given, so composing the
// styled parts straight onto UiDialog would rewrite @tamagui/ui's own
// Dialog.Overlay/.Content for every consumer of the unstyled package — the styled
// layer would leak into the unstyled one. Compose onto a fresh root and carry the
// behavior parts this skin does not restyle.
const DialogRoot = createRefComponent<
  TamaguiElement,
  React.ComponentProps<typeof UiDialog>
>(function Dialog(props, ref) {
  return <UiDialog {...props} ref={ref} />
})

export const Dialog = withStaticProperties(DialogRoot, {
  Trigger: UiDialog.Trigger,
  Portal: UiDialog.Portal,
  Title: UiDialog.Title,
  Description: UiDialog.Description,
  Close: UiDialog.Close,
  FocusScope: UiDialog.FocusScope,
  Adapt: UiDialog.Adapt,
  Overlay: DialogOverlay,
  Content: DialogContent,
})
