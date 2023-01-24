import { Adapt, useAdaptParent } from '@tamagui/adapt'
import { AnimatePresence } from '@tamagui/animate-presence'
import { hideOthers } from '@tamagui/aria-hidden'
import { useComposedRefs } from '@tamagui/compose-refs'
import {
  GetProps,
  TamaguiElement,
  Theme,
  composeEventHandlers,
  isWeb,
  spacedChildren,
  styled,
  useGet,
  useId,
  useMedia,
  useThemeName,
  withStaticProperties,
} from '@tamagui/core'
import { Scope, createContext, createContextScope } from '@tamagui/create-context'
import { Dismissable, DismissableProps } from '@tamagui/dismissable'
import { FocusScope, FocusScopeProps } from '@tamagui/focus-scope'
import { PortalHost, PortalItem, PortalItemProps } from '@tamagui/portal'
import { RemoveScroll } from '@tamagui/remove-scroll'
import { ControlledSheet, SheetController } from '@tamagui/sheet'
import { ThemeableStack, YStack, YStackProps } from '@tamagui/stacks'
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
   * @see https://github.com/theKashey/react-remove-scroll#usage
   */
  allowPinchZoom?: RemoveScrollProps['allowPinchZoom']
}

type NonNull<A> = Exclude<A, void | null>

type DialogContextValue = {
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
  sheetBreakpoint: any
  scopeKey: string
}

const [DialogProvider, useDialogContext] =
  createDialogContext<DialogContextValue>(DIALOG_NAME)

/* -------------------------------------------------------------------------------------------------
 * DialogTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'DialogTrigger'

const DialogTriggerFrame = styled(YStack, {
  name: TRIGGER_NAME,
})

interface DialogTriggerProps extends YStackProps {}

const DialogTrigger = React.forwardRef<TamaguiElement, DialogTriggerProps>(
  (props: ScopedProps<DialogTriggerProps>, forwardedRef) => {
    const { __scopeDialog, ...triggerProps } = props
    const context = useDialogContext(TRIGGER_NAME, __scopeDialog)
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef)
    return (
      <DialogTriggerFrame
        tag="button"
        aria-haspopup="dialog"
        aria-expanded={context.open}
        aria-controls={context.contentId}
        data-state={getState(context.open)}
        {...triggerProps}
        ref={composedTriggerRef}
        onPress={composeEventHandlers(props.onPress as any, context.onOpenToggle)}
      />
    )
  }
)

DialogTrigger.displayName = TRIGGER_NAME

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

type DialogPortalProps = Omit<PortalItemProps, 'asChild'> &
  YStackProps & {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true
  }

export const DialogPortalFrame = styled(YStack, {
  alignItems: 'center',
  justifyContent: 'center',
  fullscreen: true,
  zIndex: 100,
  ...(isWeb && {
    maxHeight: '100vh',
    position: 'fixed' as any,
  }),
})

const DialogPortalItem = (props: ScopedProps<DialogPortalProps>) => {
  const themeName = useThemeName()
  const context = useDialogContext(PORTAL_NAME, props.__scopeDialog)

  return (
    <PortalItem hostName={props.hostName}>
      <DialogPortalItemContent {...props} themeName={themeName} context={context} />
    </PortalItem>
  )
}

function DialogPortalItemContent(
  props: ScopedProps<DialogPortalProps> & {
    themeName: string
    context: DialogContextValue
  }
) {
  const {
    __scopeDialog,
    children,
    context,
    themeName,
    space,
    spaceDirection,
    separator,
  } = props

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
    <DialogProvider scope={__scopeDialog} {...context}>
      <Theme name={themeName}>{childrenSpaced}</Theme>
    </DialogProvider>
  )
}

const DialogPortal: React.FC<DialogPortalProps> = (
  props: ScopedProps<DialogPortalProps>
) => {
  const { __scopeDialog, forceMount, children, ...frameProps } = props

  const context = useDialogContext(PORTAL_NAME, __scopeDialog)
  const isShowing = forceMount || context.open
  const [isFullyHidden, setIsFullyHidden] = React.useState(!isShowing)

  if (isShowing && isFullyHidden) {
    setIsFullyHidden(false)
  }

  const contents = (
    <AnimatePresence
      onExitComplete={() => {
        setIsFullyHidden(true)
      }}
    >
      {isShowing ? children : null}
    </AnimatePresence>
  )
  const isSheet = useShowDialogSheet(context)

  if (isSheet) {
    return children
  }

  if (context.modal) {
    if (isFullyHidden) {
      return null
    }

    return (
      <DialogPortalItem __scopeDialog={__scopeDialog}>
        <PortalProvider scope={__scopeDialog} forceMount={forceMount}>
          <DialogPortalFrame pointerEvents={isShowing ? 'auto' : 'none'} {...frameProps}>
            {contents}
          </DialogPortalFrame>
        </PortalProvider>
      </DialogPortalItem>
    )
  }

  return contents
}

DialogPortal.displayName = PORTAL_NAME

/* -------------------------------------------------------------------------------------------------
 * DialogOverlay
 * -----------------------------------------------------------------------------------------------*/

const OVERLAY_NAME = 'DialogOverlay'

const DialogOverlayFrame = styled(ThemeableStack, {
  name: OVERLAY_NAME,
  backgrounded: true,
  fullscreen: true,
})

interface DialogOverlayProps extends YStackProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

const DialogOverlay = React.forwardRef<TamaguiElement, DialogOverlayProps>(
  ({ __scopeDialog, ...props }: ScopedProps<DialogOverlayProps>, forwardedRef) => {
    const portalContext = usePortalContext(OVERLAY_NAME, __scopeDialog)
    const { forceMount = portalContext.forceMount, ...overlayProps } = props
    const context = useDialogContext(OVERLAY_NAME, __scopeDialog)
    const showSheet = useShowDialogSheet(context)

    if (!forceMount) {
      if (!context.modal || showSheet) {
        return null
      }
    }

    return <DialogOverlayImpl context={context} {...overlayProps} ref={forwardedRef} />
  }
)

DialogOverlay.displayName = OVERLAY_NAME

type DialogOverlayImplProps = GetProps<typeof DialogOverlayFrame> & {
  context: DialogContextValue
}

const DialogOverlayImpl = React.forwardRef<TamaguiElement, DialogOverlayImplProps>(
  (props, forwardedRef) => {
    const { context, ...overlayProps } = props

    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      <DialogOverlayFrame
        data-state={getState(context.open)}
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
  tag: 'dialog',
  position: 'relative',
  backgrounded: true,
  padded: true,
  radiused: true,
  elevate: true,

  variants: {
    size: {
      '...size': (val, extras) => {
        return {}
      },
    },
  } as const,

  defaultVariants: {
    size: '$true',
  },
})

type DialogContentFrameProps = GetProps<typeof DialogContentFrame>

interface DialogContentProps
  extends DialogContentFrameProps,
    Omit<DialogContentTypeProps, 'context'> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

const DialogContent = DialogContentFrame.extractable(
  React.forwardRef<TamaguiElement, DialogContentProps>(
    ({ __scopeDialog, ...props }: ScopedProps<DialogContentProps>, forwardedRef) => {
      const portalContext = usePortalContext(CONTENT_NAME, __scopeDialog)
      const { forceMount = portalContext.forceMount, ...contentProps } = props
      const context = useDialogContext(CONTENT_NAME, __scopeDialog)

      const contents = context.modal ? (
        <DialogContentModal context={context} {...contentProps} ref={forwardedRef} />
      ) : (
        <DialogContentNonModal context={context} {...contentProps} ref={forwardedRef} />
      )

      if (!isWeb) {
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
          <div className="_dsp_contents">{contents}</div>
        </RemoveScroll>
      )
    }
  )
)

DialogContent.displayName = CONTENT_NAME

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
    const showSheet = useShowDialogSheet(context)

    const contents = (
      <DialogContentFrame
        id={context.contentId}
        aria-describedby={context.descriptionId}
        aria-labelledby={context.titleId}
        data-state={getState(context.open)}
        {...contentProps}
      />
    )

    if (showSheet) {
      return (
        <DialogPortalItem hostName={getSheetContentsName(context)}>
          {contentProps.children}
        </DialogPortalItem>
      )
    }

    if (!isWeb) {
      return contents
    }

    return (
      <>
        <FocusScope
          loop
          trapped={trapFocus}
          onMountAutoFocus={onOpenAutoFocus}
          forceUnmount={!context.open}
          onUnmountAutoFocus={onCloseAutoFocus}
        >
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
            {contents}
          </Dismissable>
        </FocusScope>
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

const TITLE_NAME = 'DialogTitle'
const DialogTitleFrame = styled(H2, {
  name: TITLE_NAME,
})

type DialogTitleProps = GetProps<typeof DialogTitleFrame>

const DialogTitle = React.forwardRef<TamaguiElement, DialogTitleProps>(
  (props: ScopedProps<DialogTitleProps>, forwardedRef) => {
    const { __scopeDialog, ...titleProps } = props
    const context = useDialogContext(TITLE_NAME, __scopeDialog)
    return <DialogTitleFrame id={context.titleId} {...titleProps} ref={forwardedRef} />
  }
)

DialogTitle.displayName = TITLE_NAME

/* -------------------------------------------------------------------------------------------------
 * DialogDescription
 * -----------------------------------------------------------------------------------------------*/

const DialogDescriptionFrame = styled(Paragraph, {
  name: 'DialogDescription',
})

type DialogDescriptionProps = GetProps<typeof DialogDescriptionFrame>

const DESCRIPTION_NAME = 'DialogDescription'

const DialogDescription = React.forwardRef<TamaguiElement, DialogDescriptionProps>(
  (props: ScopedProps<DialogDescriptionProps>, forwardedRef) => {
    const { __scopeDialog, ...descriptionProps } = props
    const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog)
    return (
      <DialogDescriptionFrame
        id={context.descriptionId}
        {...descriptionProps}
        ref={forwardedRef}
      />
    )
  }
)

DialogDescription.displayName = DESCRIPTION_NAME

/* -------------------------------------------------------------------------------------------------
 * DialogClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'DialogClose'

type DialogCloseProps = YStackProps & {
  displayWhenAdapted?: boolean
}

const DialogClose = React.forwardRef<TamaguiElement, DialogCloseProps>(
  (props: ScopedProps<DialogCloseProps>, forwardedRef) => {
    const { __scopeDialog, displayWhenAdapted, ...closeProps } = props
    const context = useDialogContext(CLOSE_NAME, __scopeDialog)
    const isSheet = useShowDialogSheet(context)

    if (isSheet && !displayWhenAdapted) {
      return null
    }

    return (
      <YStack
        tag="button"
        {...closeProps}
        ref={forwardedRef}
        onPress={composeEventHandlers(props.onPress as any, () =>
          context.onOpenChange(false)
        )}
      />
    )
  }
)

DialogClose.displayName = CLOSE_NAME

/* -----------------------------------------------------------------------------------------------*/

function getState(open: boolean) {
  return open ? 'open' : 'closed'
}

const TITLE_WARNING_NAME = 'DialogTitleWarning'

const [DialogWarningProvider, useWarningContext] = createContext(TITLE_WARNING_NAME, {
  contentName: CONTENT_NAME,
  titleName: TITLE_NAME,
  docsSlug: 'dialog',
})

type TitleWarningProps = { titleId?: string }

const TitleWarning: React.FC<TitleWarningProps> = ({ titleId }) => {
  if (process.env.NODE_ENV === 'development') {
    const titleWarningContext = useWarningContext(TITLE_WARNING_NAME)

    const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${titleWarningContext.docsSlug}`

    React.useEffect(() => {
      if (!isWeb) return
      if (titleId) {
        const hasTitle = document.getElementById(titleId)
        if (!hasTitle) {
          // eslint-disable-next-line no-console
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
          // eslint-disable-next-line no-console
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
    } = props

    const scopeId = useId()
    const contentId = useId()
    const titleId = useId()
    const descriptionId = useId()
    const scopeKey = __scopeDialog ? Object.keys(__scopeDialog)[0] : scopeId
    const sheetContentsName = getSheetContentsName({ scopeKey, contentId })
    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const contentRef = React.useRef<TamaguiElement>(null)

    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    })

    const onOpenToggle = React.useCallback(
      () => setOpen((prevOpen) => !prevOpen),
      [setOpen]
    )

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
    }

    const { when, AdaptProvider } = useAdaptParent({
      Contents: React.useCallback(
        (props) => {
          return <PortalHost forwardProps={props} name={sheetContentsName} />
        },
        [sheetContentsName]
      ),
    })

    React.useImperativeHandle(
      ref,
      () => ({
        open: setOpen,
      }),
      [setOpen]
    )

    return (
      <AdaptProvider>
        <DialogProvider {...context} sheetBreakpoint={when}>
          <DialogSheetController onOpenChange={setOpen} __scopeDialog={__scopeDialog}>
            {children}
          </DialogSheetController>
        </DialogProvider>
      </AdaptProvider>
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
    Sheet: ControlledSheet,
    Adapt,
  }
)

/* -------------------------------------------------------------------------------------------------
 * DialogSheetContents
 * -----------------------------------------------------------------------------------------------*/

const SHEET_CONTENTS_NAME = 'DialogSheetContents'

export const DialogSheetContents = ({
  name,
  ...props
}: {
  name: string
  context: Omit<DialogContextValue, 'sheetBreakpoint'>
}) => {
  return <PortalHost forwardProps={props} name={name} />
}

DialogSheetContents.displayName = SHEET_CONTENTS_NAME

const getSheetContentsName = ({
  scopeKey,
  contentId,
}: Pick<DialogContextValue, 'scopeKey' | 'contentId'>) =>
  `${scopeKey || contentId}SheetContents`

const DialogSheetController = (
  props: ScopedProps<{
    children: React.ReactNode
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  }>
) => {
  const context = useDialogContext('DialogSheetController', props.__scopeDialog)
  const showSheet = useShowDialogSheet(context)
  const breakpointActive = useSheetBreakpointActive(context)
  const getShowSheet = useGet(showSheet)
  return (
    <SheetController
      onOpenChange={(val) => {
        if (getShowSheet()) {
          props.onOpenChange(val)
        }
      }}
      open={context.open}
      hidden={breakpointActive === false}
    >
      {props.children}
    </SheetController>
  )
}

const useSheetBreakpointActive = (context: DialogContextValue) => {
  const media = useMedia()
  if (!context.sheetBreakpoint) return false
  if (context.sheetBreakpoint === true) return true
  return media[context.sheetBreakpoint]
}

const useShowDialogSheet = (context: DialogContextValue) => {
  const breakpointActive = useSheetBreakpointActive(context)
  return context.open === false ? false : breakpointActive
}

export {
  createDialogScope,
  //
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  //
  DialogWarningProvider,
}
export type {
  DialogProps,
  DialogTriggerProps,
  DialogPortalProps,
  DialogOverlayProps,
  DialogContentProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogCloseProps,
}
