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
import { Dialog as UiDialog, styled, withStaticProperties } from '@tamagui/ui'

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

export const Dialog = withStaticProperties(UiDialog, {
  Overlay: DialogOverlay,
  Content: DialogContent,
})
