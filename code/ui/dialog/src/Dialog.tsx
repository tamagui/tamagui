import { Adapt, AdaptParent, AdaptPortalContents, useAdaptIsActive } from '@tamagui/adapt'
import { AnimatePresence } from '@tamagui/animate-presence'
import { hideOthers } from '@tamagui/aria-hidden'
import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import type { GetProps, StackProps, TamaguiElement } from '@tamagui/core'
import { Theme, View, spacedChildren, styled, useThemeName } from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import { createContext, createContextScope } from '@tamagui/create-context'
import type { DismissableProps } from '@tamagui/dismissable'
import { Dismissable } from '@tamagui/dismissable'
import type { FocusScopeProps } from '@tamagui/focus-scope'
import { FocusScope } from '@tamagui/focus-scope'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import { Portal } from '@tamagui/portal'
import { RemoveScroll } from '@tamagui/remove-scroll'
import { Overlay, Sheet, SheetController } from '@tamagui/sheet'
import type { YStackProps } from '@tamagui/stacks'
import { ButtonNestingContext, ThemeableStack, YStack } from '@tamagui/stacks'
import { H2, Paragraph } from '@tamagui/text'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'

const DIALOG_NAME = 'Dialog'

type ScopedProps<P> = P & { __scopeDialog?: Scope }

const [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME)

type RemoveScrollProps = React.ComponentProps<typeof RemoveScroll>

interface DialogProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
  modal?: boolean

  /**
   * Used to disable the remove scroll functionality when open
   */
  disableRemoveScroll?: boolean

  /**
   * @see https://github.com/theKashey/react-remove-scroll#usage
   */
  allowPinchZoom?: RemoveScrollProps['allowPinchZoom']
}

type NonNull<A> = Exclude<A, void | null>

type DialogContextValue = {
  disableRemoveScroll?: boolean
  triggerRef: React.RefObject<TamaguiElement>
  contentRef: React.RefObject<TamaguiElement>
  contentId: string
  titleId: string
  descriptionId: string
  onOpenToggle(): void
  open: NonNull<DialogProps['open']>
  onOpenChange: NonNull<DialogProps['onOpenChange']>
  modal: NonNull<DialogProps['modal']>
  allowPinchZoom: NonNull<DialogProps['allowPinchZoom']>
  scopeKey: string
}

const [DialogProvider, useDialogContext] =
  createDialogContext<DialogContextValue>(DIALOG_NAME)

/* -------------------------------------------------------------------------------------------------
 * DialogTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'DialogTrigger'

const DialogTriggerFrame = styled(View, {
  name: TRIGGER_NAME,
})

interface DialogTriggerProps extends StackProps {}

const DialogTrigger = DialogTriggerFrame.styleable(function DialogTrigger(
  props: ScopedProps<DialogTriggerProps>,
  forwardedRef
) {
  const { __scopeDialog, ...triggerProps } = props
  const isInsideButton = React.useContext(ButtonNestingContext)
  const context = useDialogContext(TRIGGER_NAME, __scopeDialog)
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
})

/* -------------------------------------------------------------------------------------------------
 * DialogPortal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'DialogPortal'

type PortalContextValue = { forceMount?: true }
const [PortalProvider, usePortalContext] = createDialogContext<PortalContextValue>(
  PORTAL_NAME,
  {
    forceMount: undefined,
  }
)

type DialogPortalProps = YStackProps & {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

export const DialogPortalFrame = styled(YStack, {
  pointerEvents: 'none',

  variants: {
    unstyled: {
      false: {
        alignItems: 'center',
        justifyContent: 'center',
        fullscreen: true,
        zIndex: 100_000,
        ...(isWeb && {
          maxHeight: '100vh',
          position: 'fixed' as any,
        }),
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const DialogPortalItem = (props: ScopedProps<DialogPortalProps>) => {
  const { __scopeDialog, children, space, spaceDirection, separator } = props

  const themeName = useThemeName()
  const context = useDialogContext(PORTAL_NAME, props.__scopeDialog)

  let childrenSpaced = children

  if (space || separator) {
    childrenSpaced = spacedChildren({
      children,
      separator,
      space,
      direction: spaceDirection,
    })
  }

  // until we can use react-native portals natively
  // have to re-propogate context, sketch

  return (
    <AdaptPortalContents>
      <DialogProvider scope={__scopeDialog} {...context}>
        <Theme name={themeName}>{childrenSpaced}</Theme>
      </DialogProvider>
    </AdaptPortalContents>
  )
}

const DialogPortal: React.FC<DialogPortalProps> = (
  props: ScopedProps<DialogPortalProps>
) => {
  const { __scopeDialog, forceMount, children, ...frameProps } = props

  const context = useDialogContext(PORTAL_NAME, __scopeDialog)
  const isShowing = forceMount || context.open
  const [isFullyHidden, setIsFullyHidden] = React.useState(!isShowing)
  const isAdapted = useAdaptIsActive()

  if (isShowing && isFullyHidden) {
    setIsFullyHidden(false)
  }

  const handleExitComplete = React.useCallback(() => {
    setIsFullyHidden(true)
  }, [])

  if (context.modal) {
    const contents = (
      <AnimatePresence onExitComplete={handleExitComplete}>
        {isShowing || isAdapted ? children : null}
      </AnimatePresence>
    )

    if (isFullyHidden && !isAdapted) {
      return null
    }

    const framedContents = (
      <PortalProvider scope={__scopeDialog} forceMount={forceMount}>
        <DialogPortalFrame pointerEvents={isShowing ? 'auto' : 'none'} {...frameProps}>
          {contents}
        </DialogPortalFrame>
      </PortalProvider>
    )

    if (isWeb) {
      // no need for portal nonsense on web
      return (
        <Portal zIndex={props.zIndex ?? 100_000}>
          <PassthroughTheme>{framedContents}</PassthroughTheme>
        </Portal>
      )
    }

    return framedContents
  }

  return children
}

const PassthroughTheme = ({ children }) => {
  const themeName = useThemeName()

  return (
    <Theme name={themeName} forceClassName>
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

interface DialogOverlayProps extends YStackProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

const DialogOverlay = DialogOverlayFrame.extractable(
  React.forwardRef<TamaguiElement, DialogOverlayProps>(function DialogOverlay(
    { __scopeDialog, ...props }: ScopedProps<DialogOverlayProps>,
    forwardedRef
  ) {
    const portalContext = usePortalContext(OVERLAY_NAME, __scopeDialog)
    const { forceMount = portalContext.forceMount, ...overlayProps } = props
    const context = useDialogContext(OVERLAY_NAME, __scopeDialog)
    const isAdapted = useAdaptIsActive()

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
        // We re-enable pointer-events prevented by `Dialog.Content` to allow scrolling the overlay.
        pointerEvents={context.open ? 'auto' : 'none'}
        {...overlayProps}
        ref={forwardedRef}
      />
    )
  })
)

/* -------------------------------------------------------------------------------------------------
 * DialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'DialogContent'

const DialogContentFrame = styled(ThemeableStack, {
  name: CONTENT_NAME,
  tag: 'dialog',

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

interface DialogContentProps
  extends DialogContentFrameProps,
    Omit<DialogContentTypeProps, 'context' | 'onPointerDownCapture'> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

const DialogContent = DialogContentFrame.extractable(
  React.forwardRef<TamaguiElement, DialogContentProps>(function DialogContent(
    { __scopeDialog, ...props }: ScopedProps<DialogContentProps>,
    forwardedRef
  ) {
    const portalContext = usePortalContext(CONTENT_NAME, __scopeDialog)
    const { forceMount = portalContext.forceMount, ...contentProps } = props
    const context = useDialogContext(CONTENT_NAME, __scopeDialog)

    const contents = context.modal ? (
      <DialogContentModal context={context} {...contentProps} ref={forwardedRef} />
    ) : (
      <DialogContentNonModal context={context} {...contentProps} ref={forwardedRef} />
    )

    if (!isWeb || context.disableRemoveScroll) {
      return contents
    }

    return (
      <RemoveScroll
        forwardProps
        enabled={context.open}
        allowPinchZoom={context.allowPinchZoom}
        shards={[context.contentRef]}
        // causes lots of bugs on touch web on site
        removeScrollBar={false}
      >
        <div data-remove-scroll-container className="_dsp_contents">
          {contents}
        </div>
      </RemoveScroll>
    )
  })
)

/* -----------------------------------------------------------------------------------------------*/

interface DialogContentTypeProps
  extends Omit<DialogContentImplProps, 'trapFocus' | 'disableOutsidePointerEvents'> {
  context: DialogContextValue
}

const DialogContentModal = React.forwardRef<TamaguiElement, DialogContentTypeProps>(
  (
    { children, context, ...props }: ScopedProps<DialogContentTypeProps>,
    forwardedRef
  ) => {
    const contentRef = React.useRef<HTMLDivElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef)

    // aria-hide everything except the content (better supported equivalent to setting aria-modal)
    if (isWeb) {
      React.useEffect(() => {
        if (!context.open) return
        const content = contentRef.current
        if (content) return hideOthers(content)
      }, [context.open])
    }

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
  (props: ScopedProps<DialogContentTypeProps>, forwardedRef) => {
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

type DialogContentImplProps = DialogContentFrameProps &
  Omit<DismissableProps, 'onDismiss'> & {
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

const DialogContentImpl = React.forwardRef<TamaguiElement, DialogContentImplProps>(
  (props: ScopedProps<DialogContentImplProps>, forwardedRef) => {
    const {
      __scopeDialog,
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

    const contentRef = React.useRef<HTMLDivElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, contentRef)
    const isAdapted = useAdaptIsActive()

    // TODO this will re-parent, ideally we would not change tree structure

    if (isAdapted) {
      if (!isWeb && !context.open) {
        return null
      }

      return <DialogPortalItem>{contentProps.children}</DialogPortalItem>
    }

    const contents = (
      <DialogContentFrame
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
          // @ts-ignore
          ref={composedRefs}
          onDismiss={() => context.onOpenChange(false)}
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

type DialogTitleProps = GetProps<typeof DialogTitleFrame>

const DialogTitle = DialogTitleFrame.styleable(function DialogTitle(
  props: ScopedProps<DialogTitleProps>,
  forwardedRef
) {
  const { __scopeDialog, ...titleProps } = props
  const context = useDialogContext('DialogTitle', __scopeDialog)
  return <DialogTitleFrame id={context.titleId} {...titleProps} ref={forwardedRef} />
})

/* -------------------------------------------------------------------------------------------------
 * DialogDescription
 * -----------------------------------------------------------------------------------------------*/

const DialogDescriptionFrame = styled(Paragraph, {
  name: 'DialogDescription',
})

type DialogDescriptionProps = GetProps<typeof DialogDescriptionFrame>

const DESCRIPTION_NAME = 'DialogDescription'

const DialogDescription = DialogDescriptionFrame.styleable(function DialogDescription(
  props: ScopedProps<DialogDescriptionProps>,
  forwardedRef
) {
  const { __scopeDialog, ...descriptionProps } = props
  const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog)
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
  tag: 'button',
})

export interface DialogCloseExtraProps {
  displayWhenAdapted?: boolean
}

type DialogCloseProps = GetProps<typeof DialogCloseFrame> & DialogCloseExtraProps

const DialogClose = DialogCloseFrame.styleable<DialogCloseExtraProps>(
  (props: ScopedProps<DialogCloseProps>, forwardedRef) => {
    const { __scopeDialog, displayWhenAdapted, ...closeProps } = props
    const context = useDialogContext(CLOSE_NAME, __scopeDialog, {
      warn: false,
      fallback: {},
    })
    const isAdapted = useAdaptIsActive()
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

    const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.`

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
  React.forwardRef<{ open: (val: boolean) => void }, DialogProps>(function Dialog(
    props: ScopedProps<DialogProps>,
    ref
  ) {
    const {
      __scopeDialog,
      children,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      modal = true,
      allowPinchZoom = false,
      disableRemoveScroll = false,
    } = props

    const baseId = React.useId()
    const scopeId = `scope-${baseId}`
    const contentId = `content-${baseId}`
    const titleId = `title-${baseId}`
    const descriptionId = `description-${baseId}`
    const scopeKey = __scopeDialog ? Object.keys(__scopeDialog)[0] : scopeId
    const adaptName = getAdaptName({ scopeKey, contentId })
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

    const context = {
      scope: __scopeDialog,
      scopeKey,
      triggerRef,
      contentRef,
      contentId,
      titleId,
      descriptionId,
      open,
      onOpenChange: setOpen,
      onOpenToggle,
      modal,
      allowPinchZoom,
      disableRemoveScroll,
    }

    React.useImperativeHandle(
      ref,
      () => ({
        open: setOpen,
      }),
      [setOpen]
    )

    return (
      <AdaptParent
        scope={adaptName}
        portal={{
          forwardProps: props,
        }}
      >
        <DialogProvider {...context}>
          <DialogSheetController onOpenChange={setOpen} __scopeDialog={__scopeDialog}>
            {children}
          </DialogSheetController>
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
    Sheet: Sheet.Controlled,
    Adapt,
  }
)

const getAdaptName = ({
  scopeKey,
  contentId,
}: Pick<DialogContextValue, 'scopeKey' | 'contentId'>) =>
  `${scopeKey || contentId}DialogAdapt`

const DialogSheetController = (
  props: ScopedProps<{
    children: React.ReactNode
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  }>
) => {
  const context = useDialogContext('DialogSheetController', props.__scopeDialog)
  const isAdapted = useAdaptIsActive()

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
  createDialogScope,
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
