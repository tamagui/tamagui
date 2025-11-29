// forked from radix-ui
// https://github.com/radix-ui/primitives/blob/main/packages/react/alert-dialog/src/AlertDialog.tsx

import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import type { TamaguiElement } from '@tamagui/core'
import {
  Slottable,
  View,
  createStyledContext,
  isTamaguiElement,
  styled,
} from '@tamagui/core'
import type {
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogOverlayExtraProps,
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
} from '@tamagui/dialog'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'
import { Alert } from 'react-native'

const getAlertDialogScope = (scope?: string) => scope

/* -------------------------------------------------------------------------------------------------
 * AlertDialog
 * -----------------------------------------------------------------------------------------------*/

const ROOT_NAME = 'AlertDialog'

export type AlertDialogScopes = string

type ScopedProps<P> = Omit<P, 'scope'> & { scope?: AlertDialogScopes }

type AlertDialogProps = ScopedProps<DialogProps> & {
  native?: boolean
}

/* -------------------------------------------------------------------------------------------------
 * AlertDialogTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'AlertDialogTrigger'

type AlertDialogTriggerProps = ScopedProps<DialogTriggerProps>

const NativeAlertDialogTriggerFrame = styled(View, {
  name: TRIGGER_NAME,
})

const AlertDialogTrigger =
  NativeAlertDialogTriggerFrame.styleable<AlertDialogTriggerProps>(
    function AlertDialogTrigger(props, forwardedRef) {
      if (props['__native']) {
        const { __native, onPress, __onPress, ...rest } = props as any
        return (
          <NativeAlertDialogTriggerFrame
            {...rest}
            onPress={composeEventHandlers(onPress, __onPress)}
          />
        )
      }

      const { scope, ...triggerProps } = props
      return (
        <DialogTrigger
          scope={getAlertDialogScope(scope)}
          {...triggerProps}
          ref={forwardedRef}
        />
      )
    }
  )

/* -------------------------------------------------------------------------------------------------
 * AlertDialogPortal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'AlertDialogPortal'

type AlertDialogPortalProps = ScopedProps<DialogPortalProps>

const AlertDialogPortal: React.FC<AlertDialogPortalProps> = function AlertDialogPortal(
  props: ScopedProps<AlertDialogPortalProps>
) {
  const { scope, ...portalProps } = props
  return <DialogPortal scope={getAlertDialogScope(scope)} {...portalProps} />
}

/* -------------------------------------------------------------------------------------------------
 * AlertDialogOverlay
 * -----------------------------------------------------------------------------------------------*/

const OVERLAY_NAME = 'AlertDialogOverlay'

const AlertDialogOverlayFrame = styled(DialogOverlayFrame, {
  name: OVERLAY_NAME,
})

type AlertDialogOverlayExtraProps = ScopedProps<{}> & DialogOverlayExtraProps
type AlertDialogOverlayProps = AlertDialogOverlayExtraProps & DialogOverlayProps

const AlertDialogOverlay = AlertDialogOverlayFrame.styleable<AlertDialogOverlayProps>(
  function AlertDialogOverlay(props, forwardedRef) {
    const { scope, ...overlayProps } = props
    return (
      <DialogOverlay
        scope={getAlertDialogScope(scope)}
        {...overlayProps}
        ref={forwardedRef}
      />
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * AlertDialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'AlertDialogContent'

type AlertDialogContentContextValue = {
  cancelRef?: React.RefObject<TamaguiElement | null>
}

const {
  Provider: AlertDialogContextProvider,
  useStyledContext: useAlertDialogContentContext,
} = createStyledContext<AlertDialogContentContextValue>({}, 'AlertDialogContext')

type AlertDialogContentProps = ScopedProps<
  Omit<DialogContentProps, 'onPointerDownOutside' | 'onInteractOutside'>
>

const AlertDialogContent = React.forwardRef<TamaguiElement, AlertDialogContentProps>(
  function AlertDialogContent(props, forwardedRef) {
    const { scope, children, ...contentProps } = props
    const dialogScope = getAlertDialogScope(scope)
    const contentRef = React.useRef<TamaguiElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, contentRef)
    const cancelRef = React.useRef<TamaguiElement | null>(null)

    return (
      <DialogWarningProvider
        contentName={CONTENT_NAME}
        titleName={TITLE_NAME}
        docsSlug="alert-dialog"
      >
        <AlertDialogContextProvider scope={scope} cancelRef={cancelRef}>
          <DialogContent
            role="alertdialog"
            aria-modal={true}
            scope={dialogScope}
            {...contentProps}
            ref={composedRefs}
            onOpenAutoFocus={composeEventHandlers(
              contentProps.onOpenAutoFocus,
              (event) => {
                event.preventDefault()
                if (isWeb) {
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
        </AlertDialogContextProvider>
      </DialogWarningProvider>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * AlertDialogTitle
 * -----------------------------------------------------------------------------------------------*/

const TITLE_NAME = 'AlertDialogTitle'

type AlertDialogTitleProps = ScopedProps<DialogTitleProps>

const AlertDialogTitleFrame = styled(View, {
  name: TITLE_NAME,
})

const AlertDialogTitle = AlertDialogTitleFrame.styleable<AlertDialogTitleProps>(
  function AlertDialogTitle(props, forwardedRef) {
    const { scope, ...titleProps } = props
    return (
      <DialogTitle
        scope={getAlertDialogScope(scope)}
        {...titleProps}
        ref={forwardedRef}
      />
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * AlertDialogDescription
 * -----------------------------------------------------------------------------------------------*/

const DESCRIPTION_NAME = 'AlertDialogDescription'

type AlertDialogDescriptionProps = ScopedProps<DialogDescriptionProps>

const AlertDialogDescriptionFrame = styled(View, {
  name: DESCRIPTION_NAME,
})

const AlertDialogDescription =
  AlertDialogDescriptionFrame.styleable<AlertDialogDescriptionProps>(
    function AlertDialogDescription(props, forwardedRef) {
      const { scope, ...descriptionProps } = props
      return (
        <DialogDescription
          scope={getAlertDialogScope(scope)}
          {...descriptionProps}
          ref={forwardedRef}
        />
      )
    }
  )

/* -------------------------------------------------------------------------------------------------
 * AlertDialogAction
 * -----------------------------------------------------------------------------------------------*/

const ACTION_NAME = 'AlertDialogAction'

type AlertDialogActionProps = ScopedProps<DialogCloseProps>

const AlertDialogActionFrame = styled(View, {
  name: ACTION_NAME,
})

const AlertDialogAction = AlertDialogActionFrame.styleable<AlertDialogActionProps>(
  function AlertDialogAction(props, forwardedRef) {
    const { scope, ...actionProps } = props
    return (
      <DialogClose
        scope={getAlertDialogScope(scope)}
        {...actionProps}
        ref={forwardedRef}
      />
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * AlertDialogCancel
 * -----------------------------------------------------------------------------------------------*/

const CANCEL_NAME = 'AlertDialogCancel'

type AlertDialogCancelProps = ScopedProps<DialogCloseProps>

const AlertDialogCancelFrame = styled(View, {
  name: CANCEL_NAME,
})

const AlertDialogCancel = AlertDialogCancelFrame.styleable<AlertDialogCancelProps>(
  function AlertDialogCancel(props, forwardedRef) {
    const { scope, ...cancelProps } = props
    const { cancelRef } = useAlertDialogContentContext(scope)
    const ref = useComposedRefs(forwardedRef, cancelRef)
    return <DialogClose scope={getAlertDialogScope(scope)} {...cancelProps} ref={ref} />
  }
)

/* ---------------------------------------------------------------------------------------------- */

type DescriptionWarningProps = {
  contentRef: React.RefObject<TamaguiElement | null>
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

const AlertDialogInner: React.FC<AlertDialogProps> = (props) => {
  const { scope, native, ...alertDialogProps } = props
  const dialogScope = getAlertDialogScope(scope)

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

  return <Dialog scope={dialogScope} {...alertDialogProps} modal />
}

function forEachChildDeep(
  children: React.ReactNode[],
  onChild: (el: React.ReactElement) => boolean
) {
  for (const child of children) {
    if (!React.isValidElement(child)) continue
    if (!onChild(child)) continue
    // TODO react 19 doesn't like child.props
    const childProps = child.props as unknown as any
    if (childProps.children) {
      forEachChildDeep(React.Children.toArray(childProps.children), onChild)
    }
  }
}

function getStringChildren(child: React.ReactElement) {
  let string = ''
  forEachChildDeep(React.Children.toArray(child), (child) => {
    if (typeof (child.props as Record<string, any>).children === 'string') {
      string = (child.props as Record<string, any>).children
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
