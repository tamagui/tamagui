import {
  Adapt,
  AdaptParent,
  AdaptPortalContents,
  ProvideAdaptContext,
  useAdaptContext,
  useAdaptIsActive,
} from '@tamagui/adapt'
import { AnimatePresence } from '@tamagui/animate-presence'
import { composeRefs, useComposedRefs } from '@tamagui/compose-refs'
import { isAndroid, isIos, isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import type { GetProps, TamaguiElement, ViewProps } from '@tamagui/core'
import {
  createStyledContext,
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
import { Portal, PortalItem, resolveViewZIndex, USE_NATIVE_PORTAL } from '@tamagui/portal'
import { RemoveScroll } from '@tamagui/remove-scroll'
import { Overlay, Sheet, SheetController } from '@tamagui/sheet'
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
  onOpenChange?(open: boolean): void
  modal?: boolean

  /**
   * Used to disable the remove scroll functionality when open
   */
  disableRemoveScroll?: boolean
}>

type NonNull<A> = Exclude<A, void | null>

type DialogContextValue = {
  forceMount?: boolean
  disableRemoveScroll?: boolean
  triggerRef: React.RefObject<TamaguiElement | null>
  contentRef: React.RefObject<TamaguiElement | null>
  contentId: string
  titleId: string
  descriptionId: string
  onOpenToggle(): void
  open: NonNull<DialogProps['open']>
  onOpenChange: NonNull<DialogProps['onOpenChange']>
  modal: NonNull<DialogProps['modal']>
  dialogScope: DialogScopes
  adaptScope: string
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

const DialogTrigger = DialogTriggerFrame.styleable<ScopedProps<{}>>(
  function DialogTrigger(props, forwardedRef) {
    const { scope, ...triggerProps } = props
    const isInsideButton = React.useContext(ButtonNestingContext)
    const context = useDialogContext(scope)
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef)
    return (
      <ButtonNestingContext.Provider value={true}>
        <DialogTriggerFrame
          tag={isInsideButton ? 'span' : 'button'}
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
    forceMount?: true
  }
>

export const DialogPortalFrame = styled(YStack, {
  pointerEvents: 'none',
  tag: 'dialog',

  variants: {
    unstyled: {
      false: {
        alignItems: 'center',
        justifyContent: 'center',
        fullscreen: true,

        '$platform-web': {
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
          position: 'fixed' as any,
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

const needsRepropagation = isAndroid || (isIos && !USE_NATIVE_PORTAL)

const DialogPortalItem = ({
  context,
  children,
}: { context: DialogContextValue; children: React.ReactNode }) => {
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
  // when adapted we portal to the adapt, when not we portal to root modal if needed
  return isAdapted ? (
    <AdaptPortalContents scope={context.adaptScope}>{content}</AdaptPortalContents>
  ) : context.modal ? (
    <PortalItem hostName={context.modal ? 'root' : context.adaptScope}>
      {content}
    </PortalItem>
  ) : (
    content
  )
}

const DialogPortal = React.forwardRef<TamaguiElement, DialogPortalProps>(
  (props, forwardRef) => {
    const { scope, forceMount, children, ...frameProps } = props
    const dialogRef = React.useRef<TamaguiElement>(null)
    const ref = composeRefs(dialogRef, forwardRef)

    const context = useDialogContext(scope)
    const isMountedOrOpen = forceMount || context.open
    const [isFullyHidden, setIsFullyHidden] = React.useState(!isMountedOrOpen)
    const isAdapted = useAdaptIsActive(context.adaptScope)
    const isVisible = isMountedOrOpen ? true : !isFullyHidden

    if (isMountedOrOpen && isFullyHidden) {
      setIsFullyHidden(false)
    }

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

    const handleExitComplete = React.useCallback(() => {
      setIsFullyHidden(true)
    }, [])

    const zIndex = getExpandedShorthand('zIndex', props)

    const contents = (
      <StackZIndexContext zIndex={resolveViewZIndex(zIndex)}>
        <AnimatePresence passThrough={isAdapted} onExitComplete={handleExitComplete}>
          {isMountedOrOpen || isAdapted ? children : null}
        </AnimatePresence>
      </StackZIndexContext>
    )

    const framedContents =
      // NOTE: we remove the inner frame, but not the portal itself
      // saw a bug when we removed and re-added portals that caused stale inner contents of the portal
      // seems like a React bug itself but leaving this for now as it fixes
      isFullyHidden && !isAdapted ? null : (
        <LayoutMeasurementController disable={!isMountedOrOpen}>
          <DialogPortalFrame
            ref={ref}
            {...(isWeb &&
              isMountedOrOpen && {
                'aria-modal': true,
              })}
            // passThrough={isAdapted}
            pointerEvents={isMountedOrOpen ? 'auto' : 'none'}
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
          // set to 1000 which "boosts" it 1000 above baseline for current context
          // this makes sure its above (this first 1k) popovers on the same layer
          stackZIndex={1000}
          passThrough={isAdapted}
        >
          <PassthroughTheme passThrough={isAdapted}>{framedContents}</PassthroughTheme>
        </Portal>
      )
    }

    return isAdapted ? (
      framedContents
    ) : (
      <DialogPortalItem context={context}>{framedContents}</DialogPortalItem>
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

/* -------------------------------------------------------------------------------------------------
 * DialogOverlay
 * -----------------------------------------------------------------------------------------------*/

const OVERLAY_NAME = 'DialogOverlay'

/**
 * exported for internal use with extractable()
 */
export const DialogOverlayFrame = styled(Overlay, {
  name: OVERLAY_NAME,
})

export type DialogOverlayExtraProps = ScopedProps<{
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}>

type DialogOverlayProps = YStackProps & DialogOverlayExtraProps

const DialogOverlay = DialogOverlayFrame.styleable<DialogOverlayExtraProps>(
  function DialogOverlay({ scope, ...props }, forwardedRef) {
    const context = useDialogContext(scope)
    const { forceMount = context.forceMount, ...overlayProps } = props
    const isAdapted = useAdaptIsActive(context.adaptScope)

    if (!forceMount) {
      if (!context.modal || isAdapted) {
        return null
      }
    }

    // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
    // ie. when `Overlay` and `Content` are siblings
    return (
      <DialogOverlayFrame
        data-state={getState(context.open)}
        // TODO: this will be apply for v2
        // onPress={() => {
        //   // if the overlay is pressed, close the dialog
        //   context.onOpenChange(false)
        // }}
        // We re-enable pointer-events prevented by `Dialog.Content` to allow scrolling the overlay.
        pointerEvents={context.open ? 'auto' : 'none'}
        {...overlayProps}
        ref={forwardedRef}
      />
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * DialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'DialogContent'

const DialogContentFrame = styled(ThemeableStack, {
  name: CONTENT_NAME,

  variants: {
    size: {
      '...size': (val, extras) => {
        return {}
      },
    },

    unstyled: {
      false: {
        position: 'relative',
        backgrounded: true,
        padded: true,
        radiused: true,
        elevate: true,
        zIndex: 100_000,
      },
    },
  } as const,

  defaultVariants: {
    size: '$true',
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

type DialogContentFrameProps = GetProps<typeof DialogContentFrame>

type DialogContentExtraProps = ScopedProps<
  Omit<DialogContentTypeProps, 'context' | 'onPointerDownCapture'> & {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true
  }
>

type DialogContentProps = DialogContentFrameProps & DialogContentExtraProps

const DialogContent = DialogContentFrame.styleable<DialogContentExtraProps>(
  function DialogContent({ scope, ...props }, forwardedRef) {
    const context = useDialogContext(scope)
    const { forceMount = context.forceMount, ...contentProps } = props

    const contents = (
      <>
        {context.modal ? (
          <DialogContentModal context={context} {...contentProps} ref={forwardedRef} />
        ) : (
          <DialogContentNonModal context={context} {...contentProps} ref={forwardedRef} />
        )}
      </>
    )

    if (!isWeb || context.disableRemoveScroll) {
      return contents
    }

    return (
      <RemoveScroll enabled={context.open}>
        <div data-remove-scroll-container className="_dsp_contents">
          {contents}
        </div>
      </RemoveScroll>
    )
  }
)

/* -----------------------------------------------------------------------------------------------*/

type DialogContentTypeProps = DialogContentImplProps & {
  context: DialogContextValue
}

const DialogContentModal = React.forwardRef<TamaguiElement, DialogContentTypeProps>(
  ({ children, context, ...props }, forwardedRef) => {
    const contentRef = React.useRef<HTMLDivElement>(null)
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
          event.preventDefault()
          context.triggerRef.current?.focus()
        })}
        onPointerDownOutside={composeEventHandlers(
          props.onPointerDownOutside,
          (event) => {
            const originalEvent = event['detail'].originalEvent
            const ctrlLeftClick =
              originalEvent.button === 0 && originalEvent.ctrlKey === true
            const isRightClick = originalEvent.button === 2 || ctrlLeftClick
            // If the event is a right-click, we shouldn't close because
            // it is effectively as if we right-clicked the `Overlay`.
            if (isRightClick) event.preventDefault()
          }
        )}
        // When focus is trapped, a `focusout` event may still happen.
        // We make sure we don't trigger our `onDismiss` in such case.
        onFocusOutside={composeEventHandlers(props.onFocusOutside, (event) =>
          event.preventDefault()
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

const DialogContentNonModal = React.forwardRef<TamaguiElement, DialogContentTypeProps>(
  (props, forwardedRef) => {
    const hasInteractedOutsideRef = React.useRef(false)

    return (
      <DialogContentImpl
        {...props}
        ref={forwardedRef}
        trapFocus={false}
        disableOutsidePointerEvents={false}
        onCloseAutoFocus={(event) => {
          props.onCloseAutoFocus?.(event)

          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.current) {
              props.context.triggerRef.current?.focus()
            }
            // Always prevent auto focus because we either focus manually or want user agent focus
            event.preventDefault()
          }

          hasInteractedOutsideRef.current = false
        }}
        onInteractOutside={(event) => {
          props.onInteractOutside?.(event)

          if (!event.defaultPrevented) hasInteractedOutsideRef.current = true

          // Prevent dismissing when clicking the trigger.
          // As the trigger is already setup to close, without doing so would
          // cause it to close and immediately open.
          //
          // We use `onInteractOutside` as some browsers also
          // focus on pointer down, creating the same issue.
          const target = event.target as HTMLElement
          const trigger = props.context.triggerRef.current
          if (!(trigger instanceof HTMLElement)) return
          const targetIsTrigger = trigger.contains(target)
          if (targetIsTrigger) event.preventDefault()
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
   * Can be prevented.
   */
  onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus']

  /**
   * Event handler called when auto-focusing on close.
   * Can be prevented.
   */
  onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus']

  context: DialogContextValue
}

type DialogContentImplProps = DialogContentFrameProps & DialogContentImplExtraProps

const DialogContentImpl = React.forwardRef<TamaguiElement, DialogContentImplProps>(
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
      ...contentProps
    } = props

    const contentRef = React.useRef<HTMLDivElement>(
      // TODO react 19 type workaround
      undefined as unknown as HTMLDivElement
    )
    const composedRefs = useComposedRefs(forwardedRef, contentRef)
    const isAdapted = useAdaptIsActive(context.adaptScope)

    // TODO this will re-parent, ideally we would not change tree structure

    if (isAdapted) {
      if (!isWeb && !context.open) {
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
        aria-describedby={context.descriptionId}
        aria-labelledby={context.titleId}
        data-state={getState(context.open)}
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
              contentRef={contentRef}
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

const DialogTitle = DialogTitleFrame.styleable<DialogTitleExtraProps>(
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

const DialogDescription = DialogDescriptionFrame.styleable<DialogDescriptionExtraProps>(
  function DialogDescription(props, forwardedRef) {
    const { scope, ...descriptionProps } = props
    const context = useDialogContext(scope)
    return (
      <DialogDescriptionFrame
        id={context.descriptionId}
        {...descriptionProps}
        ref={forwardedRef}
      />
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * DialogClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'DialogClose'

const DialogCloseFrame = styled(View, {
  name: CLOSE_NAME,
  tag: 'button',
})

export type DialogCloseExtraProps = ScopedProps<{
  displayWhenAdapted?: boolean
}>

type DialogCloseProps = GetProps<typeof DialogCloseFrame> & DialogCloseExtraProps

const DialogClose = DialogCloseFrame.styleable<DialogCloseExtraProps>(
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
        accessibilityLabel="Dialog Close"
        tag={isInsideButton ? 'span' : 'button'}
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

export type DialogHandle = {
  open: (val: boolean) => void
}

const Dialog = withStaticProperties(
  React.forwardRef<{ open: (val: boolean) => void }, DialogProps>(
    function Dialog(props, ref) {
      const {
        scope = '',
        children,
        open: openProp,
        defaultOpen = false,
        onOpenChange,
        modal = true,
        disableRemoveScroll = false,
      } = props

      const baseId = React.useId()
      const dialogId = `Dialog-${scope}-${baseId}`
      const contentId = `${dialogId}-content`
      const titleId = `${dialogId}-title`
      const descriptionId = `${dialogId}-description`

      const triggerRef = React.useRef<HTMLButtonElement>(null)
      const contentRef = React.useRef<TamaguiElement>(null)

      const [open, setOpen] = useControllableState({
        prop: openProp,
        defaultProp: defaultOpen,
        onChange: onOpenChange,
      })

      const onOpenToggle = React.useCallback(() => {
        setOpen((prevOpen) => !prevOpen)
      }, [setOpen])

      const adaptScope = `DialogAdapt${scope}`

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
        disableRemoveScroll,
      } satisfies DialogContextValue

      React.useImperativeHandle(
        ref,
        () => ({
          open: setOpen,
        }),
        [setOpen]
      )

      return (
        <AdaptParent
          scope={adaptScope}
          portal={{
            forwardProps: props,
          }}
        >
          <DialogProvider scope={scope} {...context}>
            <DialogSheetController onOpenChange={setOpen} scope={scope}>
              {children}
            </DialogSheetController>
          </DialogProvider>
        </AdaptParent>
      )
    }
  ),
  {
    Trigger: DialogTrigger,
    Portal: DialogPortal,
    Overlay: DialogOverlay,
    Content: DialogContent,
    Title: DialogTitle,
    Description: DialogDescription,
    Close: DialogClose,
    Sheet: Sheet.Controlled,
    FocusScope: FocusScopeController,
    Adapt,
  }
)

const getAdaptScope = (dialogScope: string) => `DialogAdapt${dialogScope}`

const DialogSheetController = (
  props: ScopedProps<{
    children: React.ReactNode
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  }>
) => {
  const context = useDialogContext(props.scope)
  const isAdapted = useAdaptIsActive(context.adaptScope)

  return (
    <SheetController
      onOpenChange={(val) => {
        if (isAdapted) {
          props.onOpenChange?.(val)
        }
      }}
      open={context.open}
      hidden={!isAdapted}
    >
      {props.children}
    </SheetController>
  )
}

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
