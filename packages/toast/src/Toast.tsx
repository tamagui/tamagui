import {
  GetProps,
  TamaguiElement,
  composeEventHandlers,
  isWeb,
  styled,
  themeable,
  useEvent,
  useId,
  withStaticProperties,
} from '@tamagui/core'
import { ThemeableStack, YStack } from '@tamagui/stacks'
import { Paragraph, SizableText } from '@tamagui/text'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'

import { ToastAnnounceExclude } from './Announce'
import { TOAST_NAME } from './constants'
import { createToast } from './createToast'
import {
  ScopedProps,
  ToastProvider,
  ToastProviderProps,
  createToastScope,
} from './Provider'
import {
  ToastImpl,
  ToastImplFrame,
  ToastProps,
  useToastInteractiveContext,
} from './ToastImpl'
import { ToastViewport, ToastViewportProps } from './Viewport'

/* -------------------------------------------------------------------------------------------------
 * ToastTitle
 * -----------------------------------------------------------------------------------------------*/

const TITLE_NAME = 'ToastTitle'

const ToastTitleFrame = styled(SizableText, {
  name: TITLE_NAME,
  color: '$color',
  variants: {
    unstyled: {
      false: {
        size: '$4',
      },
    },
  },
  defaultVariants: {
    unstyled: false,
  },
})
type PrimitiveDivProps = GetProps<typeof ToastTitleFrame>
type ToastTitleProps = PrimitiveDivProps & {}

const ToastTitle = React.forwardRef<TamaguiElement, ToastTitleProps>(
  (props: ScopedProps<ToastTitleProps>, forwardedRef) => {
    const { __scopeToast, ...titleProps } = props
    return <ToastTitleFrame {...titleProps} ref={forwardedRef} />
  }
)

ToastTitle.displayName = TITLE_NAME

/* -------------------------------------------------------------------------------------------------
 * ToastDescription
 * -----------------------------------------------------------------------------------------------*/

const DESCRIPTION_NAME = 'ToastDescription'

const ToastDescriptionFrame = styled(SizableText, {
  name: DESCRIPTION_NAME,
  color: '$color11',
  variants: {
    unstyled: {
      false: {
        size: '$1',
      },
    },
  },
  defaultVariants: {
    unstyled: false,
  },
})
type ToastDescriptionFrameProps = GetProps<typeof ToastDescriptionFrame>
type ToastDescriptionProps = ToastDescriptionFrameProps & {}

const ToastDescription = React.forwardRef<TamaguiElement, ToastDescriptionProps>(
  (props: ScopedProps<ToastDescriptionProps>, forwardedRef) => {
    const { __scopeToast, ...descriptionProps } = props
    return <ToastDescriptionFrame {...descriptionProps} ref={forwardedRef} />
  }
)

ToastDescription.displayName = DESCRIPTION_NAME

/* -------------------------------------------------------------------------------------------------
 * ToastAction
 * -----------------------------------------------------------------------------------------------*/

const ACTION_NAME = 'ToastAction'

type ToastActionProps = ToastCloseProps & {
  /**
   * A short description for an alternate way to carry out the action. For screen reader users
   * who will not be able to navigate to the button easily/quickly.
   * @example <ToastAction altText="Goto account settings to updgrade">Upgrade</ToastAction>
   * @example <ToastAction altText="Undo (Alt+U)">Undo</ToastAction>
   */
  altText: string
}

const ToastAction = React.forwardRef<TamaguiElement, ToastActionProps>(
  (props: ScopedProps<ToastActionProps>, forwardedRef) => {
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

ToastAction.displayName = ACTION_NAME

/* -------------------------------------------------------------------------------------------------
 * ToastClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'ToastClose'

const ToastCloseFrame = styled(ThemeableStack, {
  name: CLOSE_NAME,
  tag: 'button',
})
type ToastCloseFrameProps = GetProps<typeof ToastCloseFrame>
type ToastCloseProps = ToastCloseFrameProps & {}

const ToastClose = React.forwardRef<TamaguiElement, ToastCloseProps>(
  (props: ScopedProps<ToastCloseProps>, forwardedRef) => {
    const { __scopeToast, ...closeProps } = props
    const interactiveContext = useToastInteractiveContext(CLOSE_NAME, __scopeToast)

    return (
      <ToastAnnounceExclude asChild>
        <ToastCloseFrame
          accessibilityLabel="Dialog Close"
          {...closeProps}
          ref={forwardedRef}
          onPress={composeEventHandlers(props.onPress as any, interactiveContext.onClose)}
        />
      </ToastAnnounceExclude>
    )
  }
)

ToastClose.displayName = CLOSE_NAME

/* -------------------------------------------------------------------------------------------------
 * Toast
 * -----------------------------------------------------------------------------------------------*/

const ToastComponent = React.forwardRef<TamaguiElement, ToastProps>(
  ToastImplFrame.extractable((props: ScopedProps<ToastProps>, forwardedRef) => {
    const { forceMount, open: openProp, defaultOpen, onOpenChange, ...toastProps } = props
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? true,
      onChange: onOpenChange,
    })

    const id = useId()
    const onPause = useEvent(props.onPause)
    const onResume = useEvent(props.onResume)

    if (!forceMount && !open) return null

    return (
      <ToastImpl
        id={id}
        open={open}
        {...toastProps}
        ref={forwardedRef}
        onClose={() => setOpen(false)}
        onPause={onPause}
        onResume={onResume}
        onSwipeEnd={composeEventHandlers(props.onSwipeEnd, (event) => {
          setOpen(false)
        })}
      />
    )
  })
)

ToastComponent.displayName = TOAST_NAME

const Toast = withStaticProperties(
  themeable(ToastComponent, ToastImplFrame.staticConfig),
  {
    Viewport: ToastViewport,
    Title: ToastTitle,
    Description: ToastDescription,
    Action: ToastAction,
    Close: ToastClose,
  }
)

/* ---------------------------------------------------------------------------------------------- */

export {
  Toast,
  //
  ToastProvider,
  createToast,
  createToastScope,
}
export type {
  ToastActionProps,
  ToastCloseProps,
  ToastDescriptionProps,
  ToastProps,
  ToastProviderProps,
  ToastTitleProps,
  ToastViewportProps,
}
