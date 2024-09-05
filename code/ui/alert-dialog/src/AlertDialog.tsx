// forked from radix-ui
// https://github.com/radix-ui/primitives/blob/main/packages/react/alert-dialog/src/AlertDialog.tsx

import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import type { TamaguiElement } from '@tamagui/core'
import { Slottable, View, isTamaguiElement, styled } from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import type {
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogOverlayProps,
  DialogPortalProps,
  DialogProps,
  DialogTitleProps,
  DialogTriggerProps,
} from '@tamagui/dialog'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogOverlayFrame,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogWarningProvider,
  createDialogScope,
} from '@tamagui/dialog'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'
import { Alert } from 'react-native'

/* -------------------------------------------------------------------------------------------------
 * AlertDialog
 * -----------------------------------------------------------------------------------------------*/

const ROOT_NAME = 'AlertDialog'

type ScopedProps<P> = P & { __scopeAlertDialog?: Scope }
const [createAlertDialogContext, createAlertDialogScope] = createContextScope(ROOT_NAME, [
  createDialogScope,
])

const useDialogScope = createDialogScope()

type AlertDialogProps = DialogProps & {
  native?: boolean
}

/* -------------------------------------------------------------------------------------------------
 * AlertDialogTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'AlertDialogTrigger'

interface AlertDialogTriggerProps extends DialogTriggerProps {}

const NativeAlertDialogTriggerFrame = styled(View, {
  name: TRIGGER_NAME,
})

const AlertDialogTrigger = React.forwardRef<TamaguiElement, AlertDialogTriggerProps>(
  (props: ScopedProps<AlertDialogTriggerProps>, forwardedRef) => {
    if (props['__native']) {
      const { __native, onPress, __onPress, ...rest } = props as any
      return (
        <NativeAlertDialogTriggerFrame
          {...rest}
          onPress={composeEventHandlers(onPress, __onPress)}
        />
      )
    }

    const { __scopeAlertDialog, ...triggerProps } = props
    const dialogScope = useDialogScope(__scopeAlertDialog)
    return <DialogTrigger {...dialogScope} {...triggerProps} ref={forwardedRef} />
  }
)

AlertDialogTrigger.displayName = TRIGGER_NAME

/* -------------------------------------------------------------------------------------------------
 * AlertDialogPortal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'AlertDialogPortal'

interface AlertDialogPortalProps extends DialogPortalProps {}

const AlertDialogPortal: React.FC<AlertDialogPortalProps> = (
  props: ScopedProps<AlertDialogPortalProps>
) => {
  const { __scopeAlertDialog, ...portalProps } = props
  const dialogScope = useDialogScope(__scopeAlertDialog)
  return <DialogPortal {...dialogScope} {...portalProps} />
}

AlertDialogPortal.displayName = PORTAL_NAME

/* -------------------------------------------------------------------------------------------------
 * AlertDialogOverlay
 * -----------------------------------------------------------------------------------------------*/

const OVERLAY_NAME = 'AlertDialogOverlay'

const AlertDialogOverlayFrame = styled(DialogOverlayFrame, {
  name: OVERLAY_NAME,
})

interface AlertDialogOverlayProps extends DialogOverlayProps {}

const AlertDialogOverlay = AlertDialogOverlayFrame.extractable(
  React.forwardRef<TamaguiElement, AlertDialogOverlayProps>(
    (props: ScopedProps<AlertDialogOverlayProps>, forwardedRef) => {
      const { __scopeAlertDialog, ...overlayProps } = props
      const dialogScope = useDialogScope(__scopeAlertDialog)
      return <DialogOverlay {...dialogScope} {...overlayProps} ref={forwardedRef} />
    }
  )
)

AlertDialogOverlay.displayName = OVERLAY_NAME

/* -------------------------------------------------------------------------------------------------
 * AlertDialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'AlertDialogContent'

type AlertDialogContentContextValue = {
  cancelRef: React.MutableRefObject<TamaguiElement | null>
}

const [AlertDialogContentProvider, useAlertDialogContentContext] =
  createAlertDialogContext<AlertDialogContentContextValue>(CONTENT_NAME)

interface AlertDialogContentProps
  extends Omit<DialogContentProps, 'onPointerDownOutside' | 'onInteractOutside'> {}

const AlertDialogContent = React.forwardRef<TamaguiElement, AlertDialogContentProps>(
  (props: ScopedProps<AlertDialogContentProps>, forwardedRef) => {
    const { __scopeAlertDialog, children, ...contentProps } = props
    const dialogScope = useDialogScope(__scopeAlertDialog)
    const contentRef = React.useRef<TamaguiElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, contentRef)
    const cancelRef = React.useRef<TamaguiElement | null>(null)

    return (
      <DialogWarningProvider
        contentName={CONTENT_NAME}
        titleName={TITLE_NAME}
        docsSlug="alert-dialog"
      >
        <AlertDialogContentProvider scope={__scopeAlertDialog} cancelRef={cancelRef}>
          <DialogContent
            // @ts-ignore
            role="alertdialog"
            {...dialogScope}
            {...contentProps}
            ref={composedRefs}
            onOpenAutoFocus={composeEventHandlers(
              contentProps.onOpenAutoFocus,
              (event) => {
                event.preventDefault()
                if (isWeb) {
                  // @ts-ignore
                  cancelRef.current?.focus({ preventScroll: true })
                }
              }
            )}
            onPointerDownOutside={(event) => event.preventDefault()}
            onInteractOutside={(event) => event.preventDefault()}
          >
            {/**
             * We have to use `Slottable` here as we cannot wrap the `AlertDialogContentProvider`
             * around everything, otherwise the `DescriptionWarning` would be rendered straight away.
             * This is because we want the accessibility checks to run only once the content is actually
             * open and that behaviour is already encapsulated in `DialogContent`.
             */}
            <Slottable>{children}</Slottable>
            {process.env.NODE_ENV === 'development' && (
              <DescriptionWarning contentRef={contentRef} />
            )}
          </DialogContent>
        </AlertDialogContentProvider>
      </DialogWarningProvider>
    )
  }
)

AlertDialogContent.displayName = CONTENT_NAME

/* -------------------------------------------------------------------------------------------------
 * AlertDialogTitle
 * -----------------------------------------------------------------------------------------------*/

const TITLE_NAME = 'AlertDialogTitle'

type AlertDialogTitleProps = DialogTitleProps

const AlertDialogTitle = React.forwardRef<TamaguiElement, AlertDialogTitleProps>(
  (props: ScopedProps<AlertDialogTitleProps>, forwardedRef) => {
    const { __scopeAlertDialog, ...titleProps } = props
    const dialogScope = useDialogScope(__scopeAlertDialog)
    return <DialogTitle {...dialogScope} {...titleProps} ref={forwardedRef} />
  }
)

AlertDialogTitle.displayName = TITLE_NAME

/* -------------------------------------------------------------------------------------------------
 * AlertDialogDescription
 * -----------------------------------------------------------------------------------------------*/

const DESCRIPTION_NAME = 'AlertDialogDescription'

type AlertDialogDescriptionProps = DialogDescriptionProps

const AlertDialogDescription = React.forwardRef<
  TamaguiElement,
  AlertDialogDescriptionProps
>((props: ScopedProps<AlertDialogDescriptionProps>, forwardedRef) => {
  const { __scopeAlertDialog, ...descriptionProps } = props
  const dialogScope = useDialogScope(__scopeAlertDialog)
  return <DialogDescription {...dialogScope} {...descriptionProps} ref={forwardedRef} />
})

AlertDialogDescription.displayName = DESCRIPTION_NAME

/* -------------------------------------------------------------------------------------------------
 * AlertDialogAction
 * -----------------------------------------------------------------------------------------------*/

const ACTION_NAME = 'AlertDialogAction'

type AlertDialogActionProps = DialogCloseProps

const AlertDialogAction = React.forwardRef<TamaguiElement, AlertDialogActionProps>(
  (props: ScopedProps<AlertDialogActionProps>, forwardedRef) => {
    const { __scopeAlertDialog, ...actionProps } = props
    const dialogScope = useDialogScope(__scopeAlertDialog)
    return <DialogClose {...dialogScope} {...actionProps} ref={forwardedRef} />
  }
)

AlertDialogAction.displayName = ACTION_NAME

/* -------------------------------------------------------------------------------------------------
 * AlertDialogCancel
 * -----------------------------------------------------------------------------------------------*/

const CANCEL_NAME = 'AlertDialogCancel'

interface AlertDialogCancelProps extends DialogCloseProps {}

const AlertDialogCancel = React.forwardRef<TamaguiElement, AlertDialogCancelProps>(
  (props: ScopedProps<AlertDialogCancelProps>, forwardedRef) => {
    const { __scopeAlertDialog, ...cancelProps } = props
    const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME, __scopeAlertDialog)
    const dialogScope = useDialogScope(__scopeAlertDialog)
    const ref = useComposedRefs(forwardedRef, cancelRef)
    return <DialogClose {...dialogScope} {...cancelProps} ref={ref} />
  }
)

AlertDialogCancel.displayName = CANCEL_NAME

/* ---------------------------------------------------------------------------------------------- */

type DescriptionWarningProps = {
  contentRef: React.RefObject<TamaguiElement>
}

const DescriptionWarning: React.FC<DescriptionWarningProps> = ({ contentRef }) => {
  if (process.env.NODE_ENV === 'development') {
    React.useEffect(() => {
      if (!isWeb) return
      const hasDescription = document.getElementById(
        // @ts-ignore
        contentRef.current?.getAttribute('aria-describedby')!
      )
      if (!hasDescription) {
        console.warn(`\`${CONTENT_NAME}\` requires a description for the component to be accessible for screen reader users.
  
        You can add a description to the \`${CONTENT_NAME}\` by passing a \`${DESCRIPTION_NAME}\` component as a child, which also benefits sighted users by adding visible context to the dialog.
        
        Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${CONTENT_NAME}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.
        
        For more information, see https://tamagui.dev/docs/components/alert-dialog`)
      }
    }, [contentRef])
  }

  return null
}

const AlertDialogInner: React.FC<AlertDialogProps> = (
  props: ScopedProps<AlertDialogProps>
) => {
  const { __scopeAlertDialog, native, ...alertDialogProps } = props
  const dialogScope = useDialogScope(__scopeAlertDialog)

  if (process.env.TAMAGUI_TARGET === 'native') {
    const [open, setOpen] = useControllableState({
      prop: props.open,
      defaultProp: props.defaultOpen || false,
      onChange: props.onOpenChange,
      transition: true,
    })

    let triggerElement: any = null
    let title = ''
    let description = ''
    const buttons: {
      text: string
      onPress: (value?: string | undefined) => void
      style?: 'default' | 'cancel' | 'destructive'
    }[] = []

    forEachChildDeep(React.Children.toArray(props.children), (child) => {
      if (!React.isValidElement(child)) return false
      const name = isTamaguiElement(child)
        ? child.type.staticConfig.componentName
        : (child.type['displayName'] as string | undefined)
      switch (name) {
        case TRIGGER_NAME: {
          triggerElement = React.cloneElement(child as any, {
            __native: true,
          })
          return false
        }
        case TITLE_NAME: {
          title = getStringChildren(child)
          return false
        }
        case DESCRIPTION_NAME: {
          description = getStringChildren(child)
          return false
        }
        case ACTION_NAME:
        case CANCEL_NAME: {
          const style = name === ACTION_NAME ? 'default' : 'cancel'
          const text = getStringChildren(child)
          const onPress = () => {
            const childProps = child.props as any
            childProps?.onPress?.({ native: true })
            setOpen(false)
          }
          buttons.push({
            style,
            text,
            // @ts-ignore
            onPress,
          })
          return false
        }
        default: {
          return true
        }
      }
    })

    useIsomorphicLayoutEffect(() => {
      if (!open || !native) return
      if (title || description) {
        Alert.alert(title, description, buttons)
      }
    }, [native, open])

    if (native) {
      return React.cloneElement(triggerElement, {
        __onPress: () => {
          setOpen(true)
        },
      })
    }
  }

  return <Dialog {...dialogScope} {...alertDialogProps} modal />
}

function forEachChildDeep(
  children: React.ReactNode[],
  onChild: (el: React.ReactElement) => boolean
) {
  for (const child of children) {
    if (!React.isValidElement(child)) continue
    if (!onChild(child)) continue
    if (child.props.children) {
      forEachChildDeep(React.Children.toArray(child.props.children), onChild)
    }
  }
}

function getStringChildren(child: React.ReactElement) {
  let string = ''
  forEachChildDeep(React.Children.toArray(child), (child) => {
    if (typeof child.props.children === 'string') {
      string = child.props.children
      return false
    }
    return true
  })
  return string
}

const AlertDialog = withStaticProperties(AlertDialogInner, {
  Trigger: AlertDialogTrigger,
  Portal: AlertDialogPortal,
  Overlay: AlertDialogOverlay,
  Content: AlertDialogContent,
  Action: AlertDialogAction,
  Cancel: AlertDialogCancel,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
})

AlertDialog.displayName = ROOT_NAME

export {
  //
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  createAlertDialogScope,
}
export type {
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogContentProps,
  AlertDialogDescriptionProps,
  AlertDialogOverlayProps,
  AlertDialogPortalProps,
  AlertDialogProps,
  AlertDialogTitleProps,
  AlertDialogTriggerProps,
}
