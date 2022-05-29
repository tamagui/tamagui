import { AnimatePresence } from '@tamagui/animate-presence'
import { useComposedRefs } from '@tamagui/compose-refs'
import { GetProps, composeEventHandlers, styled, useId, withStaticProperties } from '@tamagui/core'
import { Scope, createContext, createContextScope } from '@tamagui/create-context'
import { Portal } from '@tamagui/portal'
import { ThemeableStack, YStack, YStackProps } from '@tamagui/stacks'
import { H2, Paragraph } from '@tamagui/text'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'
import { Modal, ModalProps, View } from 'react-native'

const DIALOG_NAME = 'Dialog'

type ScopedProps<P> = P & { __scopeDialog?: Scope }
type TamaguiElement = HTMLElement | View

const [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME)

type DialogContextValue = {
  triggerRef: React.RefObject<TamaguiElement>
  contentRef: React.RefObject<TamaguiElement>
  contentId: string
  titleId: string
  descriptionId: string
  open: boolean
  onOpenChange(open: boolean): void
  onOpenToggle(): void
  modal: boolean
  allowPinchZoom: boolean
  // allowPinchZoom: DialogProps['allowPinchZoom'];
}

const [DialogProvider, useDialogContext] = createDialogContext<DialogContextValue>(DIALOG_NAME)

// type RemoveScrollProps = React.ComponentProps<typeof RemoveScroll>;

interface DialogProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
  modal?: boolean
  allowPinchZoom?: boolean

  /**
   * @see https://github.com/theKashey/react-remove-scroll#usage
   */
  // allowPinchZoom?: RemoveScrollProps['allowPinchZoom'];
}

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

type PortalProps = YStackProps & Pick<ModalProps, 'presentationStyle'>

interface DialogPortalProps extends Omit<PortalProps, 'asChild'> {
  children?: React.ReactNode
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

const DialogPortal: React.FC<DialogPortalProps> = (props: ScopedProps<DialogPortalProps>) => {
  const { __scopeDialog, forceMount, children, ...rest } = props
  const context = useDialogContext(PORTAL_NAME, __scopeDialog)
  const isShowing = forceMount || context.open
  return (
    <PortalProvider scope={__scopeDialog} forceMount={forceMount}>
      <Portal
        alignItems="center"
        justifyContent="center"
        zIndex={100}
        pointerEvents={isShowing ? 'auto' : 'none'}
        {...rest}
      >
        <AnimatePresence>{isShowing ? children : null}</AnimatePresence>
      </Portal>
    </PortalProvider>
  )
}

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
  (props: ScopedProps<DialogOverlayProps>, forwardedRef) => {
    const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog)
    const { forceMount = portalContext.forceMount, ...overlayProps } = props
    const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog)
    return context.modal ? (
      // <Presence present={forceMount || context.open}>
      <DialogOverlayImpl {...overlayProps} ref={forwardedRef} />
    ) : // </Presence>
    null
  }
)

DialogOverlay.displayName = OVERLAY_NAME

type DialogOverlayImplProps = GetProps<typeof DialogOverlayFrame>

const DialogOverlayImpl = React.forwardRef<TamaguiElement, DialogOverlayImplProps>(
  (props: ScopedProps<DialogOverlayImplProps>, forwardedRef) => {
    const { __scopeDialog, ...overlayProps } = props
    const context = useDialogContext(OVERLAY_NAME, __scopeDialog)
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      // <RemoveScroll as={Slot} allowPinchZoom={context.allowPinchZoom} shards={[context.contentRef]}>
      <DialogOverlayFrame
        data-state={getState(context.open)}
        {...overlayProps}
        ref={forwardedRef}
        // We re-enable pointer-events prevented by `Dialog.Content` to allow scrolling the overlay.
        // style={{ pointerEvents: 'auto', ...overlayProps.style }}
      />
      // </RemoveScroll>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * DialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'DialogContent'

const DialogContentFrame = styled(ThemeableStack, {
  name: CONTENT_NAME,
  pointerEvents: 'auto',
  position: 'relative',
  backgrounded: true,
  padded: true,
  radiused: true,
  elevate: true,
})

type DialogContentProps = GetProps<typeof DialogContentFrame> & {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

const DialogContent = React.forwardRef<TamaguiElement, DialogContentProps>(
  (props: ScopedProps<DialogContentProps>, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeDialog)
    const { forceMount = portalContext.forceMount, ...contentProps } = props
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog)
    return (
      // <Presence present={forceMount || context.open}>
      <>
        {context.modal ? (
          <DialogContentModal {...contentProps} ref={forwardedRef} />
        ) : (
          <DialogContentNonModal {...contentProps} ref={forwardedRef} />
        )}
      </>
      // </Presence>
    )
  }
)

DialogContent.displayName = CONTENT_NAME

/* -----------------------------------------------------------------------------------------------*/

interface DialogContentTypeProps
  extends Omit<DialogContentImplProps, 'trapFocus' | 'disableOutsidePointerEvents'> {}

const DialogContentModal = React.forwardRef<TamaguiElement, DialogContentTypeProps>(
  (props: ScopedProps<DialogContentTypeProps>, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef)

    // aria-hide everything except the content (better supported equivalent to setting aria-modal)
    React.useEffect(() => {
      const content = contentRef.current
      if (content) {
        console.log('should hide others')
        // return hideOthers(content)
      }
    }, [])

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
          console.log('pointer down outside')
          // const originalEvent = event.detail.originalEvent
          // const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true
          // const isRightClick = originalEvent.button === 2 || ctrlLeftClick
          // // If the event is a right-click, we shouldn't close because
          // // it is effectively as if we right-clicked the `Overlay`.
          // if (isRightClick) event.preventDefault()
        })}
        // When focus is trapped, a `focusout` event may still happen.
        // We make sure we don't trigger our `onDismiss` in such case.
        onFocusOutside={composeEventHandlers(props.onFocusOutside, (event) =>
          event.preventDefault()
        )}
      />
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
          console.log('outside?')
          props.onInteractOutside?.(event)

          if (!event.defaultPrevented) hasInteractedOutsideRef.current = true

          // Prevent dismissing when clicking the trigger.
          // As the trigger is already setup to close, without doing so would
          // cause it to close and immediately open.
          //
          // We use `onInteractOutside` as some browsers also
          // focus on pointer down, creating the same issue.
          // const target = event.target as HTMLElement
          // const targetIsTrigger = context.triggerRef.current?.contains(target)
          // if (targetIsTrigger) event.preventDefault()
        }}
      />
    )
  }
)

/* -----------------------------------------------------------------------------------------------*/

type DismissableLayerProps = any //Radix.ComponentPropsWithoutRef<typeof DismissableLayer>;
type FocusScopeProps = any // Radix.ComponentPropsWithoutRef<typeof FocusScope>;

interface DialogContentImplProps extends Omit<DismissableLayerProps, 'onDismiss'> {
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
      children,
      ...contentProps
    } = props
    const context = useDialogContext(CONTENT_NAME, __scopeDialog)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, contentRef)

    // Make sure the whole tree has focus guards as our `Dialog` will be
    // the last element in the DOM (beacuse of the `Portal`)
    // useFocusGuards();

    return <DialogContentFrame {...contentProps}>{children}</DialogContentFrame>

    return (
      <>
        {/* <FocusScope
          asChild
          loop
          trapped={trapFocus}
          onMountAutoFocus={onOpenAutoFocus}
          onUnmountAutoFocus={onCloseAutoFocus}
        > */}
        {/* <DismissableLayer
            role="dialog"
            id={context.contentId}
            aria-describedby={context.descriptionId}
            aria-labelledby={context.titleId}
            data-state={getState(context.open)}
            {...contentProps}
            ref={composedRefs}
            onDismiss={() => context.onOpenChange(false)}
          /> */}
        {/* </FocusScope> */}
        {/* {process.env.NODE_ENV !== 'production' && (
          <>
            <TitleWarning titleId={context.titleId} />
            <DescriptionWarning contentRef={contentRef} descriptionId={context.descriptionId} />
          </>
        )} */}
      </>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * DialogTitle
 * -----------------------------------------------------------------------------------------------*/

const TITLE_NAME = 'DialogTitle'
const DialogTitle = styled(H2, {
  name: TITLE_NAME,
})

type DialogTitleProps = GetProps<typeof DialogTitle>

// type DialogTitleElement = React.ElementRef<typeof Primitive.h2>;
// type PrimitiveHeading2Props = Radix.ComponentPropsWithoutRef<typeof Primitive.h2>;
// interface DialogTitleProps extends PrimitiveHeading2Props {}

// const DialogTitle = React.forwardRef<DialogTitleElement, DialogTitleProps>(
//   (props: ScopedProps<DialogTitleProps>, forwardedRef) => {
//     const { __scopeDialog, ...titleProps } = props;
//     const context = useDialogContext(TITLE_NAME, __scopeDialog);
//     return <Primitive.h2 id={context.titleId} {...titleProps} ref={forwardedRef} />;
//   }
// );

// DialogTitle.displayName = TITLE_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogDescription
 * -----------------------------------------------------------------------------------------------*/

const DialogDescription = styled(Paragraph, {
  name: 'DialogDescription',
})

type DialogDescriptionProps = GetProps<typeof DialogDescription>

// const DESCRIPTION_NAME = 'DialogDescription';

// type DialogDescriptionElement = React.ElementRef<typeof Primitive.p>;
// type PrimitiveParagraphProps = Radix.ComponentPropsWithoutRef<typeof Primitive.p>;
// interface DialogDescriptionProps extends PrimitiveParagraphProps {}

// const DialogDescription = React.forwardRef<DialogDescriptionElement, DialogDescriptionProps>(
//   (props: ScopedProps<DialogDescriptionProps>, forwardedRef) => {
//     const { __scopeDialog, ...descriptionProps } = props;
//     const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
//     return <Primitive.p id={context.descriptionId} {...descriptionProps} ref={forwardedRef} />;
//   }
// );

// DialogDescription.displayName = DESCRIPTION_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'DialogClose'

type DialogCloseProps = YStackProps

const DialogClose = React.forwardRef<TamaguiElement, DialogCloseProps>(
  (props: ScopedProps<DialogCloseProps>, forwardedRef) => {
    const { __scopeDialog, ...closeProps } = props
    const context = useDialogContext(CLOSE_NAME, __scopeDialog)
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
    if (titleId) {
      const hasTitle = document.getElementById(titleId)
      if (!hasTitle) throw new Error(MESSAGE)
    }
  }, [MESSAGE, titleId])

  return null
}

// const DESCRIPTION_WARNING_NAME = 'DialogDescriptionWarning'

// type DescriptionWarningProps = {
//   contentRef: React.RefObject<TamaguiElement>
//   descriptionId?: string
// }

// const DescriptionWarning: React.FC<DescriptionWarningProps> = ({ contentRef, descriptionId }) => {
//   const descriptionWarningContext = useWarningContext(DESCRIPTION_WARNING_NAME)
//   const MESSAGE = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${descriptionWarningContext.contentName}}.`

//   React.useEffect(() => {
//     const describedById = contentRef.current?.getAttribute('aria-describedby')
//     // if we have an id and the user hasn't set aria-describedby={undefined}
//     if (descriptionId && describedById) {
//       const hasDescription = document.getElementById(descriptionId)
//       if (!hasDescription) console.warn(MESSAGE)
//     }
//   }, [MESSAGE, contentRef, descriptionId])

//   return null
// }

/* -------------------------------------------------------------------------------------------------
 * Dialog
 * -----------------------------------------------------------------------------------------------*/

const Dialog: React.FC<DialogProps> = withStaticProperties(
  (props: ScopedProps<DialogProps>) => {
    const {
      __scopeDialog,
      children,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      modal = true,
      allowPinchZoom,
    } = props
    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const contentRef = React.useRef<TamaguiElement>(null)
    const [open = false, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    })

    return (
      <DialogProvider
        scope={__scopeDialog}
        triggerRef={triggerRef}
        contentRef={contentRef}
        contentId={useId() || ''}
        titleId={useId() || ''}
        descriptionId={useId() || ''}
        open={open}
        onOpenChange={setOpen}
        onOpenToggle={React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])}
        modal={modal}
        allowPinchZoom={allowPinchZoom || false}
      >
        {children}
      </DialogProvider>
    )
  },
  {
    Trigger: DialogTrigger,
    Portal: DialogPortal,
    Overlay: DialogOverlay,
    Content: DialogContent,
    Title: DialogTitle,
    Description: DialogDescription,
    Close: DialogClose,
  }
)

Dialog.displayName = DIALOG_NAME

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
