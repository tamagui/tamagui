import {
  AlertDialog as UiAlertDialog,
  createRefComponent,
  styled,
  type TamaguiElement,
  withStaticProperties,
} from '@tamagui/ui'
import type * as React from 'react'
import { dialogContentStyles, dialogOverlayStyles } from './Dialog'

export const AlertDialogOverlay = styled(UiAlertDialog.Overlay, {
  name: 'AlertDialogOverlay',
  ...dialogOverlayStyles,
})

export const AlertDialogContent = styled(UiAlertDialog.Content, {
  name: 'AlertDialogContent',
  ...dialogContentStyles,
})

const AlertDialogRoot = createRefComponent<
  TamaguiElement,
  React.ComponentProps<typeof UiAlertDialog>
>(function AlertDialog(props, _ref) {
  return <UiAlertDialog {...props} />
})

export const AlertDialog = withStaticProperties(AlertDialogRoot, {
  Trigger: UiAlertDialog.Trigger,
  Portal: UiAlertDialog.Portal,
  Title: UiAlertDialog.Title,
  Description: UiAlertDialog.Description,
  Action: UiAlertDialog.Action,
  Cancel: UiAlertDialog.Cancel,
  Destructive: UiAlertDialog.Destructive,
  Overlay: AlertDialogOverlay,
  Content: AlertDialogContent,
})
