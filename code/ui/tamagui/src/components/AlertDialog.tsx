import { AlertDialog as UiAlertDialog } from '@tamagui/alert-dialog'
import {
  createRefComponent,
  styled,
  type TamaguiElement,
  withStaticProperties,
} from '@tamagui/core'
import type * as React from 'react'
import { dialogContentStyles, dialogOverlayStyles } from './Dialog'

export const AlertDialogOverlay = styled(UiAlertDialog.Overlay, {
  displayName: 'AlertDialogOverlay',
  ...dialogOverlayStyles,
})

export const AlertDialogContent = styled(UiAlertDialog.Content, {
  displayName: 'AlertDialogContent',
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
