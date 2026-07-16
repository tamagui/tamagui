import {
  Adapt,
  AdaptParent,
  AdaptPortalContents,
  ProvideAdaptContext,
  useAdaptContext,
  useAdaptIsActive,
} from '@tamagui/adapt'
import { Animate } from '@tamagui/animate'
import { composeRefs, useComposedRefs } from '@tamagui/compose-refs'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import type { GetProps, TamaguiElement, ViewProps } from '@tamagui/core'
import {
  createStyledHOC,
  createStyledContext,
  createRefComponent,
  getExpandedShorthand,
  LayoutMeasurementController,
  styled,
  Theme,
  useThemeName,
  View,
} from '@tamagui/core'
import { createContext } from '@tamagui/create-context'
import type { DismissableProps } from '@tamagui/dismissable'
import { Dismissable } from '@tamagui/dismissable'
import type { FocusScopeProps } from '@tamagui/focus-scope'
import { FocusScope, FocusScopeController } from '@tamagui/focus-scope'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import {
  needsPortalRepropagation,
  Portal,
  PortalItem,
  resolveViewZIndex,
} from '@tamagui/portal'
import { RemoveScroll } from '@tamagui/remove-scroll'
import type { YStackProps } from '@tamagui/stacks'
import { ButtonNestingContext, ThemeableStack, YStack } from '@tamagui/stacks'
import { H2, Paragraph } from '@tamagui/text'
import { useControllableState } from '@tamagui/use-controllable-state'
import { StackZIndexContext } from '@tamagui/z-index-stack'
import * as React from 'react'

export type DialogScopes = string

type ScopedProps<P> = P & { scope?: DialogScopes }

type DialogProps = ScopedProps<{
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean

  /**
   * When true, children never un-mount, otherwise they mount on open.
   *
   * @default false
   */
  keepChildrenMounted?: boolean
  onOpenChange?(open: boolean): void
  modal?: boolean

  /**
   * Used to disable the remove scroll functionality when open
   */
  disableRemoveScroll?: boolean

  /**
   * Called when the dialog open/close animation completes.
   */
  onAnimationComplete?: (info: { open: boolean }) => void
}>

type DialogContextValue = {
  forceMount?: boolean
  keepChildrenMounted?: boolean
  disableRemoveScroll?: boolean
  hasPresentParts: boolean
  setPartPresence(id: string, present: boolean): void
  triggerRef: React.RefObject<TamaguiElement | null>
  contentRef: React.RefObject<TamaguiElement | null>
  contentId: string
  titleId: string
  descriptionId: string
  onOpenToggle(): void
  open: Exclude<DialogProps['open'], void | null>
  onOpenChange: Exclude<DialogProps['onOpenChange'], void | null>
  modal: Exclude<DialogProps['modal'], void | null>
  dialogScope: DialogScopes
  adaptScope: string
  onAnimationComplete?: DialogProps['onAnimationComplete']
}

export const DialogContext = createStyledContext<DialogContextValue>(
  // since we always provide this we can avoid setting here
  {} as DialogContextValue,
  'Dialog__'
)

export const { useStyledContext: useDialogContext, Provider: DialogProvider } =
  DialogContext

/* -------------------------------------------------------------------------------------------------
 * DialogTrigger
 * -----------------------------------------------------------------------------------------------*/

const DialogTriggerFrame = styled(View, {
  name: 'DialogTrigger',
})

type DialogTriggerProps = ScopedProps<ViewProps>

const DialogTrigger = createStyledHOC(DialogTriggerFrame)<ScopedProps<{}>>(
  function DialogTrigger(props, forwardedRef) {
    const { scope, ...triggerProps } = props
    const isInsideButton = React.useContext(ButtonNestingContext)
    const context = useDialogContext(scope)
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef)
    return (
      <ButtonNestingContext.Provider value={true}>
        <DialogTriggerFrame
          render={isInsideButton ? 'span' : 'button'}
          aria-haspopup="dialog"
          aria-expanded={context.open}
          aria-controls={context.contentId}
          data-state={getState(context.open)}
          {...triggerProps}
          ref={composedTriggerRef}
          onPress={composeEventHandlers(props.onPress as any, context.onOpenToggle)}
        />
      </ButtonNestingContext.Provider>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * DialogPortal
 * -----------------------------------------------------------------------------------------------*/

type DialogPortalProps = ScopedProps<
  YStackProps & {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: boolean
  }
>

export const DialogPortalFrame = styled(YStack, {
  pointerEvents: 'none',
  render: 'dialog',

  variants: {
    unstyled: {
      false: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        inset: 0,

        $web: {
          // undo dialog styles
          borderWidth: 0,
          backgroundColor: 'transparent',
          color: 'inherit',
          maxInlineSize: 'none',
          margin: 0,
          width: 'auto',
          height: 'auto',
          // ensure always in frame and right height
          maxHeight: '100vh',
          position: 'fixed',
          // ensure dialog inherits stacking context from portal wrapper
          zIndex: 1,
        },
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const needsRepropagation = needsPortalRepropagation()

const DialogPortalItem = ({
  context,
  children,
}: {
  context: DialogContextValue
  children: React.ReactNode
}) => {
  const themeName = useThemeName()
  const isAdapted = useAdaptIsActive(context.adaptScope)
  const adaptContext = useAdaptContext(context.adaptScope)

  let content = <Theme name={themeName}>{children}</Theme>

  // not just adapted - both sheet and portal for modal need it
  if (needsRepropagation) {
    content = (
      <ProvideAdaptContext {...adaptContext}>
        <DialogProvider {...context}>{content}</DialogProvider>
      </ProvideAdaptContext>
    )
  }

  // until we can use react-native portals natively
  // have to re-propogate context, sketch
  // when adapted we publish to the Adapt live slot, otherwise we portal to root modal if needed
  return isAdapted ? (
    <AdaptPortalContents scope={context.adaptScope}>{content}</AdaptPortalContents>
  ) : context.modal ? (
    <PortalItem hostName="root">{content}</PortalItem>
  ) : (
    content
  )
}

const DialogPortal = createRefComponent<TamaguiElement, DialogPortalProps>(
  (props, forwardedRef) => {
    const { scope, forceMount, children, ...frameProps } = props
    const dialogRef = React.useRef<TamaguiElement>(null)
    const ref = composeRefs(dialogRef, forwardedRef)

    const context = useDialogContext(scope)
    const portalContext = forceMount ? { ...context, forceMount: true } : context
    const keepMounted = forceMount || context.keepChildrenMounted
    const isAdapted = useAdaptIsActive(context.adaptScope)
    const isVisible = context.open || context.hasPresentParts

    if (isWeb) {
      useIsomorphicLayoutEffect(() => {
        const node = dialogRef.current
        if (!(node instanceof HTMLDialogElement)) return
        // optional chaining for JSDOM compatibility (doesn't implement show/close)
        if (isVisible) {
          node.show?.()
        } else {
          node.close?.()
        }
      }, [isVisible])
    }

    const zIndex = getExpandedShorthand('zIndex', props)

    const contents = (
      <StackZIndexContext zIndex={resolveViewZIndex(zIndex)}>
        <DialogProvider scope={context.dialogScope} {...portalContext}>
          {children}
        </DialogProvider>
      </StackZIndexContext>
    )

    const framedContents =
      !isVisible && !keepMounted && !isAdapted ? null : (
        <LayoutMeasurementController disable={!context.open}>
          <DialogPortalFrame
            ref={ref}
            {...(isWeb &&
              context.open && {
                'aria-modal': true,
              })}
            pointerEvents={context.open ? 'auto' : 'none'}
            {...frameProps}
            className={`_no_backdrop ` + (frameProps.className || '')}
          >
            {contents}
          </DialogPortalFrame>
        </LayoutMeasurementController>
      )

    if (isWeb) {
      return (
        <Portal
          zIndex={zIndex}
          // set to 100000 which ensures dialogs are above most fixed UI (headers, navs)
          // this makes sure its above typical stacking contexts
          stackZIndex={100000}
          passThrough={isAdapted}
        >
          <PassthroughTheme passThrough={isAdapted}>{framedContents}</PassthroughTheme>
        </Portal>
      )
    }

    return isAdapted ? (
      framedContents
    ) : (
      <DialogPortalItem context={portalContext}>{framedContents}</DialogPortalItem>
    )
  }
)

const PassthroughTheme = ({
  children,
  passThrough,
}: {
  passThrough?: boolean
  children?: React.ReactNode
}) => {
  const themeName = useThemeName()

  return (
    <Theme passThrough={passThrough} name={themeName} forceClassName>
      {children}
    </Theme>
  )
}

function useDialogAnimationReporter(context: DialogContextValue) {
  const onAnimationCompleteRef = React.useRef(context.onAnimationComplete)
  onAnimationCompleteRef.current = context.onAnimationComplete

  const openRef = React.useRef(context.open)
  const pendingTransitionRef = React.useRef<boolean | null>(context.open ? true : null)

  if (openRef.current !== context.open) {
    openRef.current = context.open
    pendingTransitionRef.current = context.open
  }

  const reportComplete = React.useCallback((open: boolean) => {
    if (pendingTransitionRef.current !== open) return
    if (openRef.current !== open) return

    pendingTransitionRef.current = null
    onAnimationCompleteRef.current?.({ open })
  }, [])

  return React.useMemo(
    () => ({
      onEnterComplete: () => reportComplete(true),
      onExitComplete: () => reportComplete(false),
    }),
    [reportComplete]
  )
}

function useDialogPartPresence(
  context: DialogContextValue,
  options: {
    disabled?: boolean
    forceMount?: boolean
    id: string
    onExitComplete?: () => void
  }
) {
  const [isFullyHidden, setIsFullyHidden] = React.useState(!context.open)
  const reactId = React.useId()
  const partPresenceId = `${context.contentId}-${options.id}-${reactId}`
  const keepMounted = options.forceMount || context.keepChildrenMounted
  const isPresent = context.open || !isFullyHidden

  useIsomorphicLayoutEffect(() => {
    if (context.open && isFullyHidden) {
      setIsFullyHidden(false)
    }
  }, [context.open, isFullyHidden])

  useIsomorphicLayoutEffect(() => {
    if (options.disabled) return

    context.setPartPresence(partPresenceId, isPresent)
    return () => {
      context.setPartPresence(partPresenceId, false)
    }
  }, [context.setPartPresence, isPresent, options.disabled, partPresenceId])

  const onExitComplete = React.useCallback(() => {
    setIsFullyHidden(true)
    options.onExitComplete?.()
  }, [options.onExitComplete])

  return {
    keepMounted,
    onExitComplete,
    shouldRender: Boolean(keepMounted || context.open || !isFullyHidden),
  }
}

/* -------------------------------------------------------------------------------------------------
 * DialogOverlay
 * -----------------------------------------------------------------------------------------------*/

const OVERLAY_NAME = 'DialogOverlay'

export const DialogOverlayFrame = styled(YStack, {
  name: OVERLAY_NAME,
  zIndex: 1,

  variants: {
    open: {
      true: {
        pointerEvents: 'auto',
      },
      false: {
        pointerEvents: 'none',
      },
    },

    unstyled: {
      false: {
        inset: 0,
        position: 'absolute',
        backgroundColor: '$background',
        pointerEvents: 'auto',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

export type DialogOverlayExtraProps = ScopedProps<{
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: boolean
}>

type DialogOverlayProps = YStackProps & DialogOverlayExtraProps

const DialogOverlay = createStyledHOC(DialogOverlayFrame)<DialogOverlayExtraProps>(
  function DialogOverlay({ scope, ...props }, forwardedRef) {
    const context = useDialogContext(scope)
    const { forceMount = context.forceMount, exitStyle, ...overlayProps } = props
    const isAdapted = useAdaptIsActive(context.adaptScope)
    const presence = useDialogPartPresence(context, {
      disabled: isAdapted,
      forceMount,
      id: 'overlay',
    })

    if (!forceMount && isAdapted) {
      return null
    }

    if (!presence.shouldRender) {
      return null
    }

    // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
    // ie. when `Overlay` and `Content` are siblings
    return (
      <Animate
        type="presence"
        present={Boolean(context.open)}
        keepChildrenMounted={Boolean(presence.keepMounted)}
        onExitComplete={presence.onExitComplete}
        passThrough={isAdapted}
      >
        <DialogOverlayFrame
          key={`${context.contentId}-overlay`}
          data-state={getState(context.open)}
          // We re-enable pointer-events prevented by `Dialog.Content` to allow scrolling the overlay.
          pointerEvents={context.open ? 'auto' : 'none'}
          // presence freezes the exiting clone with open=true props, so the
          // open-keyed pointerEvents above stays "auto" during exit — exitStyle
          // applies while exiting and lets clicks pass through immediately
          exitStyle={{ pointerEvents: 'none', ...exitStyle }}
          {...overlayProps}
          ref={forwardedRef}
        />
      </Animate>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * DialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'DialogContent'

const DialogContentFrame = styled(ThemeableStack, {
  name: CONTENT_NAME,
  zIndex: 2,

  variants: {
    unstyled: {
      false: {
        position: 'relative',
        backgroundColor: '$background',
        borderWidth: 1,
        borderColor: '$borderColor',
        padding: true,
        borderRadius: true,
        elevate: true,
        // Ensure content receives pointer events (fixes React 19 + display:contents inheritance)
        pointerEvents: 'auto',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

type DialogContentFrameProps = GetProps<typeof DialogContentFrame>

type DialogContentExtraProps = ScopedProps<
  Omit<DialogContentTypeProps, 'context' | 'onPointerDownCapture'>
>

type DialogContentProps = DialogContentFrameProps & DialogContentExtraProps

const DialogContent = createStyledHOC(DialogContentFrame)<DialogContentExtraProps>(
  function DialogContent({ scope, ...props }, forwardedRef) {
    const context = useDialogContext(scope)
    const isAdapted = useAdaptIsActive(context.adaptScope)
    const reporter = useDialogAnimationReporter(context)
    const onDidAnimateProp = props.onDidAnimate
    const onDidAnimate = React.useCallback(() => {
      reporter.onEnterComplete()
      onDidAnimateProp?.()
    }, [reporter.onEnterComplete, onDidAnimateProp])
    const presence = useDialogPartPresence(context, {
      disabled: isAdapted,
      forceMount: context.forceMount,
      id: 'content',
      onExitComplete: reporter.onExitComplete,
    })

    const contents = (
      <>
        {context.modal ? (
          <DialogContentModal
            context={context}
            {...props}
            onDidAnimate={onDidAnimate}
            ref={forwardedRef}
          />
        ) : (
          <DialogContentNonModal
            context={context}
            {...props}
            onDidAnimate={onDidAnimate}
            ref={forwardedRef}
          />
        )}
      </>
    )

    if (isAdapted) {
      if (!isWeb || context.disableRemoveScroll) {
        return contents
      }

      return (
        <RemoveScroll enabled={context.open && context.modal}>
          <div data-remove-scroll-container className="_dsp_contents">
            {contents}
          </div>
        </RemoveScroll>
      )
    }

    if (!presence.shouldRender) {
      return null
    }

    const animated = (
      <Animate
        type="presence"
        present={Boolean(context.open)}
        keepChildrenMounted={Boolean(presence.keepMounted)}
        onExitComplete={presence.onExitComplete}
      >
        <React.Fragment key={context.contentId}>{contents}</React.Fragment>
      </Animate>
    )

    if (!isWeb || context.disableRemoveScroll) {
      return animated
    }

    // RemoveScroll must stay OUTSIDE the presence boundary: the exiting clone
    // freezes props, so an enabled={open} baked inside it would keep the body
    // pointer-events lock for the whole exit animation
    return (
      <RemoveScroll enabled={context.open && context.modal}>
        <div data-remove-scroll-container className="_dsp_contents">
          {animated}
        </div>
      </RemoveScroll>
    )
  }
)

/* -----------------------------------------------------------------------------------------------*/

type DialogContentTypeProps = DialogContentImplProps & {
  context: DialogContextValue
}

const DialogContentModal = createRefComponent<TamaguiElement, DialogContentTypeProps>(
  ({ children, context: contextProp, ...props }, forwardedRef) => {
    // re-read context via hook: this component renders inside the presence
    // boundary, whose exiting clone freezes props at open=true — a hook
    // subscription still receives fresh context so open-derived behavior
    // (body pointer-events lock, focus trap) releases as soon as close starts
    const context = useDialogContext(contextProp.dialogScope)
    const contentRef = React.useRef<TamaguiElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef)

    return (
      <DialogContentImpl
        {...props}
        context={context}
        ref={composedRefs}
        // we make sure focus isn't trapped once `DialogContent` has been closed
        // (closed !== unmounted when animating out)
        trapFocus={context.open}
        disableOutsidePointerEvents
        onCloseAutoFocus={composeEventHandlers(props.onCloseAutoFocus, (event) => {
          event.cancel()
          context.triggerRef.current?.focus()
        })}
        onPointerDownOutside={composeEventHandlers(
          props.onPointerDownOutside,
          (event) => {
            const originalEvent = event.event
            if (!originalEvent) return
            const ctrlLeftClick =
              originalEvent.button === 0 && originalEvent.ctrlKey === true
            const isRightClick = originalEvent.button === 2 || ctrlLeftClick
            // If the event is a right-click, we shouldn't close because
            // it is effectively as if we right-clicked the `Overlay`.
            if (isRightClick) event.cancel()
          }
        )}
        // When focus is trapped, a `focusout` event may still happen.
        // We make sure we don't trigger our `onDismiss` in such case.
        onFocusOutside={composeEventHandlers(props.onFocusOutside, (event) =>
          event.cancel()
        )}
        {...(!props.unstyled && {
          outlineStyle: 'none',
        })}
      >
        {children}
      </DialogContentImpl>
    )
  }
)

/* -----------------------------------------------------------------------------------------------*/

const DialogContentNonModal = createRefComponent<TamaguiElement, DialogContentTypeProps>(
  (props, forwardedRef) => {
    // fresh context read for the same presence-freeze reason as DialogContentModal
    const context = useDialogContext(props.context.dialogScope)
    const hasInteractedOutsideRef = React.useRef(false)

    return (
      <DialogContentImpl
        {...props}
        context={context}
        ref={forwardedRef}
        trapFocus={false}
        disableOutsidePointerEvents={false}
        onCloseAutoFocus={(event) => {
          props.onCloseAutoFocus?.(event)

          if (!event.isCanceled) {
            if (!hasInteractedOutsideRef.current) {
              props.context.triggerRef.current?.focus()
            }
            // Always prevent auto focus because we either focus manually or want user agent focus
            event.cancel()
          }

          hasInteractedOutsideRef.current = false
        }}
        onInteractOutside={(event) => {
          props.onInteractOutside?.(event)

          if (!event.isCanceled) hasInteractedOutsideRef.current = true

          // Prevent dismissing when clicking the trigger.
          // As the trigger is already setup to close, without doing so would
          // cause it to close and immediately open.
          //
          // We use `onInteractOutside` as some browsers also
          // focus on pointer down, creating the same issue.
          const target = event.event?.target as HTMLElement | null
          const trigger = props.context.triggerRef.current
          if (!target || !(trigger instanceof HTMLElement)) return
          const targetIsTrigger = trigger.contains(target)
          if (targetIsTrigger) event.cancel()
        }}
      />
    )
  }
)

/* -----------------------------------------------------------------------------------------------*/

type DialogContentImplExtraProps = Omit<DismissableProps, 'onDismiss'> & {
  /**
   * When `true`, focus cannot escape the `Content` via keyboard,
   * pointer, or a programmatic focus.
   * @defaultValue false
   */
  trapFocus?: FocusScopeProps['trapped']

  /**
   * Event handler called when auto-focusing on open.
   * Can be canceled.
   */
  onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus']

  /**
   * Event handler called when auto-focusing on close.
   * Can be canceled.
   */
  onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus']

  context: DialogContextValue
  onDidAnimate?: () => void
}

type DialogContentImplProps = DialogContentFrameProps & DialogContentImplExtraProps

const DialogContentImpl = createRefComponent<TamaguiElement, DialogContentImplProps>(
  (props, forwardedRef) => {
    const {
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      context,
      onDidAnimate,
      ...contentProps
    } = props

    const contentRef = React.useRef<TamaguiElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, contentRef)
    const isAdapted = useAdaptIsActive(context.adaptScope)
    const adaptContext = useAdaptContext(context.adaptScope)

    // TODO this will re-parent, ideally we would not change tree structure

    if (isAdapted) {
      if (
        !context.open &&
        !context.keepChildrenMounted &&
        adaptContext.targetFullyHidden
      ) {
        return null
      }

      return (
        <DialogPortalItem context={context}>{contentProps.children}</DialogPortalItem>
      )
    }

    const contents = (
      <DialogContentFrame
        ref={composedRefs}
        id={context.contentId}
        role="dialog"
        aria-modal={context.modal}
        aria-describedby={context.descriptionId}
        aria-labelledby={context.titleId}
        data-state={getState(context.open)}
        // allow clicking through content during exit animation
        pointerEvents={context.open ? 'auto' : 'none'}
        onDidAnimate={onDidAnimate}
        {...contentProps}
      />
    )

    if (!isWeb) {
      return contents
    }

    return (
      <>
        <Dismissable
          disableOutsidePointerEvents={context.open && disableOutsidePointerEvents}
          forceUnmount={!context.open}
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={onPointerDownOutside}
          onFocusOutside={onFocusOutside}
          onInteractOutside={onInteractOutside}
          onDismiss={() => context?.onOpenChange?.(false)}
        >
          <FocusScope
            loop
            enabled={context.open}
            trapped={trapFocus}
            onMountAutoFocus={onOpenAutoFocus}
            forceUnmount={!context.open}
            onUnmountAutoFocus={onCloseAutoFocus}
          >
            {contents}
          </FocusScope>
        </Dismissable>

        {process.env.NODE_ENV === 'development' && (
          <>
            <TitleWarning titleId={context.titleId} />
            <DescriptionWarning
              contentRef={contentRef as any}
              descriptionId={context.descriptionId}
            />
          </>
        )}
      </>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * DialogTitle
 * -----------------------------------------------------------------------------------------------*/

const DialogTitleFrame = styled(H2, {
  name: 'DialogTitle',
})

type DialogTitleExtraProps = ScopedProps<{}>
type DialogTitleProps = DialogTitleExtraProps & GetProps<typeof DialogTitleFrame>

const DialogTitle = createStyledHOC(DialogTitleFrame)<DialogTitleExtraProps>(
  function DialogTitle(props, forwardedRef) {
    const { scope, ...titleProps } = props
    const context = useDialogContext(scope)
    return <DialogTitleFrame id={context.titleId} {...titleProps} ref={forwardedRef} />
  }
)

/* -------------------------------------------------------------------------------------------------
 * DialogDescription
 * -----------------------------------------------------------------------------------------------*/

const DialogDescriptionFrame = styled(Paragraph, {
  name: 'DialogDescription',
})

type DialogDescriptionExtraProps = ScopedProps<{}>
type DialogDescriptionProps = DialogDescriptionExtraProps &
  GetProps<typeof DialogDescriptionFrame>

const DialogDescription = createStyledHOC(
  DialogDescriptionFrame
)<DialogDescriptionExtraProps>(function DialogDescription(props, forwardedRef) {
  const { scope, ...descriptionProps } = props
  const context = useDialogContext(scope)
  return (
    <DialogDescriptionFrame
      id={context.descriptionId}
      {...descriptionProps}
      ref={forwardedRef}
    />
  )
})

/* -------------------------------------------------------------------------------------------------
 * DialogClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'DialogClose'

const DialogCloseFrame = styled(View, {
  name: CLOSE_NAME,
  render: 'button',
})

export type DialogCloseExtraProps = ScopedProps<{
  displayWhenAdapted?: boolean
}>

type DialogCloseProps = GetProps<typeof DialogCloseFrame> & DialogCloseExtraProps

const DialogClose = createStyledHOC(DialogCloseFrame)<DialogCloseExtraProps>(
  (props, forwardedRef) => {
    const { scope, displayWhenAdapted, ...closeProps } = props
    const context = useDialogContext(scope)
    const isAdapted = useAdaptIsActive(context.adaptScope)
    const isInsideButton = React.useContext(ButtonNestingContext)

    if (isAdapted && !displayWhenAdapted) {
      return null
    }

    return (
      <DialogCloseFrame
        aria-label="Dialog Close"
        render={isInsideButton ? 'span' : 'button'}
        {...closeProps}
        ref={forwardedRef}
        onPress={composeEventHandlers(props.onPress as any, () => {
          context.onOpenChange(false)
        })}
      />
    )
  }
)

/* -----------------------------------------------------------------------------------------------*/

function getState(open: boolean) {
  return open ? 'open' : 'closed'
}

const TITLE_WARNING_NAME = 'DialogTitleWarning'

const [DialogWarningProvider, useWarningContext] = createContext(TITLE_WARNING_NAME, {
  contentName: CONTENT_NAME,
  titleName: 'DialogTitle',
  docsSlug: 'dialog',
})

type TitleWarningProps = { titleId?: string }

const TitleWarning: React.FC<TitleWarningProps> = ({ titleId }) => {
  if (process.env.NODE_ENV === 'development') {
    const titleWarningContext = useWarningContext(TITLE_WARNING_NAME)

    const MESSAGE = `\`${titleWarningContext.contentName}\` wants a \`${titleWarningContext.titleName}\` to be accessible. If you want to hide the \`${titleWarningContext.titleName}\`, wrap it with <VisuallyHidden />.`

    React.useEffect(() => {
      if (!isWeb) return
      if (titleId) {
        const hasTitle = document.getElementById(titleId)
        if (!hasTitle) {
          console.warn(MESSAGE)
        }
      }
    }, [MESSAGE, titleId])
  }

  return null
}

const DESCRIPTION_WARNING_NAME = 'DialogDescriptionWarning'

type DescriptionWarningProps = {
  contentRef: React.RefObject<TamaguiElement>
  descriptionId?: string
}

const DescriptionWarning: React.FC<DescriptionWarningProps> = ({
  contentRef,
  descriptionId,
}) => {
  if (process.env.NODE_ENV === 'development') {
    const descriptionWarningContext = useWarningContext(DESCRIPTION_WARNING_NAME)
    const MESSAGE = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${descriptionWarningContext.contentName}}.`

    React.useEffect(() => {
      if (!isWeb) return
      const contentNode = contentRef.current
      if (!(contentNode instanceof HTMLElement)) {
        return
      }
      const describedById = contentNode.getAttribute('aria-describedby')
      // if we have an id and the user hasn't set aria-describedby={undefined}
      if (descriptionId && describedById) {
        const hasDescription = document.getElementById(descriptionId)
        if (!hasDescription) {
          console.warn(MESSAGE)
        }
      }
    }, [MESSAGE, contentRef, descriptionId])
  }

  return null
}

/* -------------------------------------------------------------------------------------------------
 * Dialog
 * -----------------------------------------------------------------------------------------------*/

const Dialog = withStaticProperties(
  createRefComponent<TamaguiElement, DialogProps>(function Dialog(props) {
    const {
      scope = '',
      children,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      modal = true,
      keepChildrenMounted,
      disableRemoveScroll = false,
      onAnimationComplete,
    } = props

    const baseId = React.useId()
    const dialogId = `Dialog-${scope}-${baseId}`
    const contentId = `${dialogId}-content`
    const titleId = `${dialogId}-title`
    const descriptionId = `${dialogId}-description`

    const triggerRef = React.useRef<TamaguiElement>(null)
    const contentRef = React.useRef<TamaguiElement>(null)
    const presentPartIdsRef = React.useRef(new Set<string>())
    const [presentPartCount, setPresentPartCount] = React.useState(0)

    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    })

    const onOpenToggle = React.useCallback(() => {
      setOpen((prevOpen) => !prevOpen)
    }, [setOpen])

    const adaptScope = `DialogAdapt${scope}`

    const setPartPresence = React.useCallback((id: string, present: boolean) => {
      const presentPartIds = presentPartIdsRef.current
      const hasPart = presentPartIds.has(id)

      if (present && !hasPart) {
        presentPartIds.add(id)
        setPresentPartCount(presentPartIds.size)
      } else if (!present && hasPart) {
        presentPartIds.delete(id)
        setPresentPartCount(presentPartIds.size)
      }
    }, [])

    const context = {
      dialogScope: scope,
      adaptScope,
      triggerRef,
      contentRef,
      contentId,
      titleId,
      descriptionId,
      open,
      onOpenChange: setOpen,
      onOpenToggle,
      modal,
      keepChildrenMounted,
      disableRemoveScroll,
      hasPresentParts: presentPartCount > 0,
      setPartPresence,
      onAnimationComplete,
    } satisfies DialogContextValue

    return (
      <AdaptParent scope={adaptScope} open={open} onOpenChange={setOpen} state={context}>
        <DialogProvider scope={scope} {...context}>
          {children}
        </DialogProvider>
      </AdaptParent>
    )
  }),
  {
    Trigger: DialogTrigger,
    Portal: DialogPortal,
    Overlay: DialogOverlay,
    Content: DialogContent,
    Title: DialogTitle,
    Description: DialogDescription,
    Close: DialogClose,
    FocusScope: FocusScopeController,
    Adapt,
  }
)

export {
  //
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  //
  DialogWarningProvider,
}
export type {
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogOverlayProps,
  DialogPortalProps,
  DialogProps,
  DialogTitleProps,
  DialogTriggerProps,
}
