import { Portal, PortalHost } from '@gorhom/portal'
import { AnimatePresence } from '@tamagui/animate-presence'
import { useComposedRefs } from '@tamagui/compose-refs'
import { useEvent, useGet } from '@tamagui/core'
import {
  GetProps,
  MediaPropKeys,
  Slot,
  Theme,
  composeEventHandlers,
  isWeb,
  styled,
  useId,
  useMedia,
  useThemeName,
  withStaticProperties,
} from '@tamagui/core'
import { Scope, createContext, createContextScope } from '@tamagui/create-context'
import { Dismissable, DismissableProps } from '@tamagui/dismissable'
import { FocusScope, FocusScopeProps } from '@tamagui/focus-scope'
import { Sheet, SheetController } from '@tamagui/sheet'
import { ThemeableStack, YStack, YStackProps } from '@tamagui/stacks'
import { H2, Paragraph } from '@tamagui/text'
import { useControllableState } from '@tamagui/use-controllable-state'
import { hideOthers } from 'aria-hidden'
import * as React from 'react'
import { View } from 'react-native'
import { RemoveScroll } from 'react-remove-scroll'

const DIALOG_NAME = 'Dialog'

type ScopedProps<P> = P & { __scopeDialog?: Scope }
type TamaguiElement = HTMLElement | View

const [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME)

interface DialogProps {
  sheetBreakpoint?: MediaPropKeys | false
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
  sheetBreakpoint: NonNull<DialogProps['sheetBreakpoint']>
  scopeKey: string
}

const [DialogProvider, useDialogContext] = createDialogContext<DialogContextValue>(DIALOG_NAME)

type RemoveScrollProps = React.ComponentProps<typeof RemoveScroll>

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
        onPress={composeEventHandlers(props.onPress, context.onOpenToggle)}
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
const [PortalProvider, usePortalContext] = createDialogContext<PortalContextValue>(PORTAL_NAME, {
  forceMount: undefined,
})

type PortalType = typeof Portal
type PortalProps = PortalType extends (props: infer Props) => any ? Props : never

type DialogPortalProps = Omit<PortalProps, 'asChild'> &
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
  }),
})

const DialogPortal: React.FC<DialogPortalProps> = DialogPortalFrame.extractable(
  (props: ScopedProps<DialogPortalProps>) => {
    const { __scopeDialog, forceMount, children, ...frameProps } = props
    const themeName = useThemeName()
    const context = useDialogContext(PORTAL_NAME, __scopeDialog)
    const isShowing = forceMount || context.open
    const contents = <AnimatePresence>{isShowing ? children : null}</AnimatePresence>
    const isSheet = useShowDialogSheet(context)
    if (!context.modal || isSheet || (!isWeb && !isShowing)) {
      return contents
    }
    return (
      <Portal>
        {/* have to re-propogate context, sketch */}
        <DialogProvider scope={__scopeDialog} {...context}>
          <Theme name={themeName}>
            <PortalProvider scope={__scopeDialog} forceMount={forceMount}>
              <DialogPortalFrame pointerEvents={isShowing ? 'auto' : 'none'} {...frameProps}>
                {contents}
              </DialogPortalFrame>
            </PortalProvider>
          </Theme>
        </DialogProvider>
      </Portal>
    )
  }
)

DialogPortal.displayName = PORTAL_NAME

/* -------------------------------------------------------------------------------------------------
 * DialogOverlay
 * -----------------------------------------------------------------------------------------------*/

const OVERLAY_NAME = 'DialogOverlay'

const DialogOverlayFrame = styled(ThemeableStack, {
  name: OVERLAY_NAME,
  pointerEvents: 'auto',
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

    return <DialogOverlayImpl {...overlayProps} ref={forwardedRef} />
  }
)

DialogOverlay.displayName = OVERLAY_NAME

type DialogOverlayImplProps = GetProps<typeof DialogOverlayFrame>

const DialogOverlayImpl = React.forwardRef<TamaguiElement, DialogOverlayImplProps>(
  (props: ScopedProps<DialogOverlayImplProps>, forwardedRef) => {
    const { __scopeDialog, ...overlayProps } = props
    const context = useDialogContext(OVERLAY_NAME, __scopeDialog)
    const content = (
      <DialogOverlayFrame
        data-state={getState(context.open)}
        // We re-enable pointer-events prevented by `Dialog.Content` to allow scrolling the overlay.
        pointerEvents="auto"
        {...overlayProps}
        ref={forwardedRef}
      />
    )

    if (!isWeb) {
      return content
    }

    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      <RemoveScroll as={Slot} allowPinchZoom={context.allowPinchZoom} shards={[context.contentRef]}>
        {content}
      </RemoveScroll>
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
  pointerEvents: 'auto',
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
  },

  defaultVariants: {
    size: '$4',
  },
})

type DialogContentFrameProps = GetProps<typeof DialogContentFrame>

interface DialogContentProps extends DialogContentFrameProps, DialogContentTypeProps {
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

      return (
        <>
          {context.modal ? (
            <DialogContentModal {...contentProps} ref={forwardedRef} />
          ) : (
            <DialogContentNonModal {...contentProps} ref={forwardedRef} />
          )}
        </>
      )
    }
  )
)

DialogContent.displayName = CONTENT_NAME

/* -----------------------------------------------------------------------------------------------*/

interface DialogContentTypeProps
  extends Omit<DialogContentImplProps, 'trapFocus' | 'disableOutsidePointerEvents'> {}

const DialogContentModal = React.forwardRef<TamaguiElement, DialogContentTypeProps>(
  ({ __scopeDialog, children, ...props }: ScopedProps<DialogContentTypeProps>, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME, __scopeDialog)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef)

    // aria-hide everything except the content (better supported equivalent to setting aria-modal)
    React.useEffect(() => {
      if (!context.open) return
      const content = contentRef.current
      if (content) return hideOthers(content)
    }, [context.open])

    return (
      <DialogContentImpl
        {...props}
        ref={composedRefs}
        // we make sure focus isn't trapped once `DialogContent` has been closed
        // (closed !== unmounted when animating out)
        trapFocus={context.open}
        disableOutsidePointerEvents
        onCloseAutoFocus={composeEventHandlers(props.onCloseAutoFocus, (event) => {
          event.preventDefault()
          context.triggerRef.current?.focus()
        })}
        onPointerDownOutside={composeEventHandlers(props.onPointerDownOutside, (event) => {
          const originalEvent = event['detail'].originalEvent
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick
          // If the event is a right-click, we shouldn't close because
          // it is effectively as if we right-clicked the `Overlay`.
          if (isRightClick) event.preventDefault()
        })}
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
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog)
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
            if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus()
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
          const trigger = context.triggerRef.current
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
      ...contentProps
    } = props
    const context = useDialogContext(CONTENT_NAME, __scopeDialog)
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
      return <Portal hostName={`${context.scopeKey}SheetContents`}>{contentProps.children}</Portal>
    }

    return (
      <>
        <FocusScope
          loop
          trapped={trapFocus}
          onMountAutoFocus={onOpenAutoFocus}
          onUnmountAutoFocus={onCloseAutoFocus}
        >
          <Dismissable
            disableOutsidePointerEvents={disableOutsidePointerEvents}
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
            <DescriptionWarning contentRef={contentRef} descriptionId={context.descriptionId} />
          </>
        )}
      </>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * DialogSheetContents
 * -----------------------------------------------------------------------------------------------*/

const SHEET_CONTENTS_NAME = 'DialogSheetContents'

export const DialogSheetContents = ({ __scopeDialog }: ScopedProps<{}>) => {
  const context = useDialogContext(SHEET_CONTENTS_NAME, __scopeDialog)
  return <PortalHost name={`${context.scopeKey}SheetContents`}></PortalHost>
}

DialogSheetContents.displayName = SHEET_CONTENTS_NAME

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
      <DialogDescriptionFrame id={context.descriptionId} {...descriptionProps} ref={forwardedRef} />
    )
  }
)

DialogDescription.displayName = DESCRIPTION_NAME

/* -------------------------------------------------------------------------------------------------
 * DialogClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'DialogClose'

type DialogCloseProps = YStackProps

const DialogClose = React.forwardRef<TamaguiElement, DialogCloseProps>(
  (props: ScopedProps<DialogCloseProps>, forwardedRef) => {
    const { __scopeDialog, ...closeProps } = props
    const context = useDialogContext(CLOSE_NAME, __scopeDialog)
    const isSheet = useShowDialogSheet(context)

    if (isSheet) {
      return null
    }

    return (
      <YStack
        tag="button"
        {...closeProps}
        ref={forwardedRef}
        onPress={composeEventHandlers(props.onPress, () => context.onOpenChange(false))}
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

const [WarningProvider, useWarningContext] = createContext(TITLE_WARNING_NAME, {
  contentName: CONTENT_NAME,
  titleName: TITLE_NAME,
  docsSlug: 'dialog',
})

type TitleWarningProps = { titleId?: string }

const TitleWarning: React.FC<TitleWarningProps> = ({ titleId }) => {
  const titleWarningContext = useWarningContext(TITLE_WARNING_NAME)

  const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${titleWarningContext.docsSlug}`

  React.useEffect(() => {
    if (!isWeb) return
    if (titleId) {
      const hasTitle = document.getElementById(titleId)
      if (!hasTitle) throw new Error(MESSAGE)
    }
  }, [MESSAGE, titleId])

  return null
}

const DESCRIPTION_WARNING_NAME = 'DialogDescriptionWarning'

type DescriptionWarningProps = {
  contentRef: React.RefObject<TamaguiElement>
  descriptionId?: string
}

const DescriptionWarning: React.FC<DescriptionWarningProps> = ({ contentRef, descriptionId }) => {
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
      if (!hasDescription) console.warn(MESSAGE)
    }
  }, [MESSAGE, contentRef, descriptionId])

  return null
}

/* -------------------------------------------------------------------------------------------------
 * Dialog
 * -----------------------------------------------------------------------------------------------*/

const DialogInner = React.forwardRef<{ open: (val: boolean) => void }, DialogProps>(function Dialog(
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
    sheetBreakpoint = false,
  } = props
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const contentRef = React.useRef<TamaguiElement>(null)
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  })

  React.useImperativeHandle(
    ref,
    () => ({
      open: setOpen,
    }),
    [setOpen]
  )

  return (
    <DialogProvider
      scope={__scopeDialog}
      scopeKey={__scopeDialog ? Object.keys(__scopeDialog)[0] : ''}
      triggerRef={triggerRef}
      contentRef={contentRef}
      contentId={useId() || ''}
      titleId={useId() || ''}
      descriptionId={useId() || ''}
      open={open}
      onOpenChange={setOpen}
      onOpenToggle={React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])}
      modal={modal}
      allowPinchZoom={allowPinchZoom}
      sheetBreakpoint={sheetBreakpoint}
    >
      <DialogSheetController onChangeOpen={setOpen} __scopeDialog={__scopeDialog}>
        {children}
      </DialogSheetController>
    </DialogProvider>
  )
})

const Dialog = withStaticProperties(DialogInner, {
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
  SheetContents: DialogSheetContents,
  Sheet,
})

const DialogSheetController = (
  props: ScopedProps<{}> & {
    children: React.ReactNode
    onChangeOpen: React.Dispatch<React.SetStateAction<boolean>>
  }
) => {
  const context = useDialogContext('DialogSheetController', props.__scopeDialog)
  const showSheet = useShowDialogSheet(context)
  const breakpointActive = useDialogBreakpointActive(context)
  const getShowSheet = useGet(showSheet)
  return (
    <SheetController
      disableDrag
      onChangeOpen={(val) => {
        if (getShowSheet()) {
          props.onChangeOpen(val)
        }
      }}
      open={context.open}
      hidden={breakpointActive === false}
    >
      {props.children}
    </SheetController>
  )
}

const useDialogBreakpointActive = (context: DialogContextValue) => {
  const media = useMedia()
  return context.sheetBreakpoint ? media[context.sheetBreakpoint] : false
}

const useShowDialogSheet = (context: DialogContextValue) => {
  const breakpointActive = useDialogBreakpointActive(context)
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
  WarningProvider,
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
