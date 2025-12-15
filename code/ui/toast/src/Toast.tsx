import { AnimatePresence } from '@tamagui/animate-presence'
import type { GetProps, NativePlatform, NativeValue, TamaguiElement } from '@tamagui/core'
import { styled, useEvent } from '@tamagui/core'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import { YStack } from '@tamagui/stacks'
import { SizableText } from '@tamagui/text'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'
import { ToastAnnounceExclude } from './ToastAnnounce'
import type { CustomData } from './ToastImperative'
import { useToast, useToastController, useToastState } from './ToastImperative'
import type { ToastExtraProps, ToastProps } from './ToastImpl'
import { ToastImpl, ToastImplFrame, useToastInteractiveContext } from './ToastImpl'
import type { ScopedProps, ToastProviderProps } from './ToastProvider'
import { ToastProvider } from './ToastProvider'
import type { ToastViewportProps } from './ToastViewport'
import { ToastViewport } from './ToastViewport'

/* -------------------------------------------------------------------------------------------------
 * ToastTitle
 * -----------------------------------------------------------------------------------------------*/

const TITLE_NAME = 'ToastTitle'

const ToastTitle = styled(SizableText, {
  name: TITLE_NAME,

  variants: {
    unstyled: {
      false: {
        color: '$color',
        size: '$4',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

type ToastTitleProps = GetProps<typeof ToastTitle>

/* -------------------------------------------------------------------------------------------------
 * ToastDescription
 * -----------------------------------------------------------------------------------------------*/

const DESCRIPTION_NAME = 'ToastDescription'

const ToastDescription = styled(SizableText, {
  name: DESCRIPTION_NAME,

  variants: {
    unstyled: {
      false: {
        color: '$color11',
        size: '$1',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

type ToastDescriptionProps = GetProps<typeof ToastDescription>

/* -------------------------------------------------------------------------------------------------
 * ToastAction
 * -----------------------------------------------------------------------------------------------*/

const ACTION_NAME = 'ToastAction'

type ToastActionProps = ScopedProps<
  ToastCloseProps & {
    /**
     * A short description for an alternate way to carry out the action. For screen reader users
     * who will not be able to navigate to the button easily/quickly.
     * @example <ToastAction altText="Goto account settings to updgrade">Upgrade</ToastAction>
     * @example <ToastAction altText="Undo (Alt+U)">Undo</ToastAction>
     */
    altText: string
  }
>

const ToastAction = React.forwardRef<TamaguiElement, ScopedProps<ToastActionProps>>(
  function ToastAction(props, forwardedRef) {
    const { altText, ...actionProps } = props
    if (!altText) return null
    return (
      <ToastAnnounceExclude altText={altText} asChild>
        <ToastClose {...actionProps} ref={forwardedRef} />
      </ToastAnnounceExclude>
    )
  }
)

ToastAction.propTypes = {
  altText(props) {
    if (!props.altText) {
      return new Error(`Missing prop \`altText\` expected on \`${ACTION_NAME}\``)
    }
    return null
  },
}

/* -------------------------------------------------------------------------------------------------
 * ToastClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'ToastClose'

const ToastCloseFrame = styled(YStack, {
  name: CLOSE_NAME,
  render: 'button',
})

type ToastCloseFrameProps = GetProps<typeof ToastCloseFrame>
type ToastCloseProps = ScopedProps<ToastCloseFrameProps & {}>

const ToastClose = React.forwardRef<TamaguiElement, ToastCloseProps>(
  function ToastClose(props, forwardedRef) {
    const { scope, ...closeProps } = props
    const interactiveContext = useToastInteractiveContext(scope)

    return (
      <ToastAnnounceExclude asChild>
        <ToastCloseFrame
          aria-label="Dialog Close"
          {...closeProps}
          ref={forwardedRef}
          onPress={composeEventHandlers(props.onPress as any, interactiveContext.onClose)}
        />
      </ToastAnnounceExclude>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * Toast
 * -----------------------------------------------------------------------------------------------*/

const ToastComponent = ToastImplFrame.styleable<ToastExtraProps>(
  function Toast(props, forwardedRef) {
    const { forceMount, open: openProp, defaultOpen, onOpenChange, ...toastProps } = props
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? true,
      onChange: onOpenChange,
      strategy: 'most-recent-wins',
    })

    const currentToast = useToastState()
    const { hide } = useToastController()

    const id = React.useId()
    const onPause = useEvent(props.onPause)
    const onResume = useEvent(props.onResume)
    const isHide = currentToast?.hide === true
    const shouldShow = (forceMount || open) && !isHide

    return (
      <AnimatePresence key={id}>
        {shouldShow ? (
          <ToastImpl
            id={id}
            open={open}
            {...toastProps}
            ref={forwardedRef}
            onClose={() => {
              setOpen(false)
              hide()
            }}
            onPause={onPause}
            onResume={onResume}
            onSwipeEnd={composeEventHandlers(props.onSwipeEnd, (event) => {
              setOpen(false)
            })}
          />
        ) : null}
      </AnimatePresence>
    )
  }
)

const Toast = withStaticProperties(ToastComponent, {
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose,
})

/* ---------------------------------------------------------------------------------------------- */

export {
  Toast,
  ToastProvider,
  ToastViewport,
  //
  // imperative
  useToast,
  useToastController,
  useToastState,
}
export type {
  // imperative
  CustomData,
  ToastActionProps,
  ToastCloseProps,
  ToastDescriptionProps,
  NativePlatform as ToastNativePlatform,
  // backwards
  NativeValue as ToastNativeValue,
  ToastProps,
  ToastProviderProps,
  ToastTitleProps,
  ToastViewportProps,
}
