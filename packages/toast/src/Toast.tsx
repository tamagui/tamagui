import { AnimatePresence } from '@tamagui/animate-presence'
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
import { YStack } from '@tamagui/stacks'
import { Paragraph, SizableText } from '@tamagui/text'
import { useControllableState } from '@tamagui/use-controllable-state'
import { ToastOptions as BurntToastOptions } from 'burnt/build/types'
import * as React from 'react'

import { ToastAnnounceExclude } from './Announce'
import { TOAST_NAME } from './constants'
import { createNativeToast } from './createNativeToast'
import {
  ScopedProps,
  ToastProvider,
  ToastProviderProps,
  createToastScope,
  useToastProviderContext,
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
  variants: {
    unstyled: {
      false: {
        size: '$6',
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

const ToastDescriptionFrame = styled(Paragraph, {
  name: DESCRIPTION_NAME,
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

const ToastCloseFrame = styled(YStack, {
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

    return (
      <AnimatePresence>
        {(forceMount || open) && (
          <ToastImpl
            key={id}
            open={open}
            {...toastProps}
            ref={forwardedRef}
            onClose={() => setOpen(false)}
            onPause={onPause}
            onResume={onResume}
            onSwipeStart={composeEventHandlers(props.onSwipeStart, (event) => {
              if (isWeb) {
                const target = event.currentTarget as HTMLDivElement
                target.setAttribute('data-swipe', 'start')
              }
            })}
            onSwipeMove={composeEventHandlers(props.onSwipeMove, (event) => {
              if (isWeb) {
                const { x, y } = event.detail.delta

                const target = event.currentTarget as HTMLDivElement
                target.setAttribute('data-swipe', 'move')
                target.style.setProperty('--toast-swipe-move-x', `${x}px`)
                target.style.setProperty('--toast-swipe-move-y', `${y}px`)
              }
            })}
            onSwipeCancel={composeEventHandlers(props.onSwipeCancel, (event) => {
              if (isWeb) {
                const target = event.currentTarget as HTMLDivElement

                target.setAttribute('data-swipe', 'cancel')
                target.style.removeProperty('--toast-swipe-move-x')
                target.style.removeProperty('--toast-swipe-move-y')
                target.style.removeProperty('--toast-swipe-end-x')
                target.style.removeProperty('--toast-swipe-end-y')
              }
            })}
            onSwipeEnd={composeEventHandlers(props.onSwipeEnd, (event) => {
              if (isWeb) {
                const target = event.currentTarget as HTMLDivElement

                const { x, y } = event.detail.delta
                target.setAttribute('data-swipe', 'end')
                target.style.removeProperty('--toast-swipe-move-x')
                target.style.removeProperty('--toast-swipe-move-y')
                target.style.setProperty('--toast-swipe-end-x', `${x}px`)
                target.style.setProperty('--toast-swipe-end-y', `${y}px`)
              }
              setOpen(false)
            })}
          />
        )}
      </AnimatePresence>
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

interface CreateToastOptions {
  native: boolean | ('web' | 'mobile')[]
}
interface ToastOptions extends BurntToastOptions {
  additionalInfo?: Record<string, any>
}

const createToast = (options: CreateToastOptions) => {
  const context = useToastProviderContext('useToast', undefined)
  const [toasts, setToasts] = React.useState<any[]>([])

  return {
    toastCount: context.toastCount,
    toasts: options.native ? [] : toasts,
    show: (
      showOptions: Pick<
        CreateNativeToastsOptions,
        'title' | 'body' | 'preset' | 'duration'
      >
    ) => {
      const id = toasts.length ? toasts[toasts.length - 1].id + 1 : 1
      // context.onToastAdd()
      setToasts([...toasts, { id, ...showOptions }])
      if (
        options.native === true ||
        (Array.isArray(options.native) &&
          ((isWeb && options.native.includes('web')) ||
            (!isWeb && options.native.includes('mobile'))))
      ) {
        createNativeToast(showOptions)
      }
    },
    hide: () => {
      // context.onToastRemove()
    },
  }
}

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
