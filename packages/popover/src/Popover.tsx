import "@tamagui/polyfill-dev";

import { Adapt, useAdaptParent } from "@tamagui/adapt";
import { Animate } from "@tamagui/animate";
import { hideOthers } from "@tamagui/aria-hidden";
import { useComposedRefs } from "@tamagui/compose-refs";
import {
  MediaQueryKey,
  SizeTokens,
  Stack,
  StackProps,
  TamaguiElement,
  Theme,
  View,
  composeEventHandlers,
  isWeb,
  useEvent,
  useGet,
  useMedia,
  useThemeName,
  withStaticProperties,
} from "@tamagui/core";
import { DismissableProps } from "@tamagui/dismissable";
import { FloatingOverrideContext } from "@tamagui/floating";
import { FocusScope, FocusScopeProps } from "@tamagui/focus-scope";
import {
  Popper,
  PopperAnchor,
  PopperArrow,
  PopperArrowProps,
  PopperContent,
  PopperContentFrame,
  PopperContentProps,
  createPopperScope,
  PopperProps,
} from "@tamagui/popper";
import { Portal, PortalHost, PortalItem } from "@tamagui/portal";
import { RemoveScroll, RemoveScrollProps } from "@tamagui/remove-scroll";
import { Sheet, SheetController } from "@tamagui/sheet";
import { YStack, YStackProps } from "@tamagui/stacks";
import { useControllableState } from "@tamagui/use-controllable-state";
import * as React from "react";
import { Freeze } from "react-freeze";
import { Platform, ScrollView } from "react-native";

import { useFloatingContext } from "./useFloatingContext";
import { createContextScope } from "@tamagui/create-context";
import type { Scope } from "@tamagui/create-context";

// adapted from radix-ui popover

export type PopoverProps = PopperProps & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  keepChildrenMounted?: boolean;
};

type PopoverContextValue = {
  id: string;
  triggerRef: React.RefObject<any>;
  contentId?: string;
  open: boolean;
  onOpenChange(open: boolean): void;
  onOpenToggle(): void;
  hasCustomAnchor: boolean;
  onCustomAnchorAdd(): void;
  onCustomAnchorRemove(): void;
  size?: SizeTokens;
  sheetBreakpoint: any;
  breakpointActive?: boolean;
  keepChildrenMounted?: boolean;
};
const POPOVER_NAME = "Popover";

type ScopedProps<P> = P & { __scopePopover?: Scope };
export const [createPopoverContext, createPopoverScope] = createContextScope(POPOVER_NAME, [
  createPopperScope,
]);
export const [PopoverProvider, usePopoverContext] =
  createPopoverContext<PopoverContextValue>("Popover");

const usePopperScope = createPopperScope();
/* -------------------------------------------------------------------------------------------------
 * PopoverAnchor
 * -----------------------------------------------------------------------------------------------*/

export type PopoverAnchorProps = YStackProps;
const ANCHOR_NAME = "PopoverAnchor";

export const PopoverAnchor = React.forwardRef<TamaguiElement, ScopedProps<PopoverAnchorProps>>(
  function PopoverAnchor(props: ScopedProps<PopoverAnchorProps>, forwardedRef) {
    const { __scopePopover, ...rest } = props;
    const context = usePopoverContext(ANCHOR_NAME, __scopePopover);
    const popperScope = usePopperScope(__scopePopover);
    const { onCustomAnchorAdd, onCustomAnchorRemove } = context;

    React.useEffect(() => {
      onCustomAnchorAdd();
      return () => onCustomAnchorRemove();
    }, [onCustomAnchorAdd, onCustomAnchorRemove]);

    return <PopperAnchor {...popperScope} {...rest} ref={forwardedRef} />;
  },
);

/* -------------------------------------------------------------------------------------------------
 * PopoverTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = "PopoverTrigger";

export type PopoverTriggerProps = StackProps;

export const PopoverTrigger = React.forwardRef<TamaguiElement, PopoverTriggerProps>(
  function PopoverTrigger(props: ScopedProps<PopoverTriggerProps>, forwardedRef) {
    const { __scopePopover, ...rest } = props;
    const context = usePopoverContext(TRIGGER_NAME, __scopePopover);
    const popperScope = usePopperScope(__scopePopover);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);

    const trigger = (
      <View
        aria-haspopup="dialog"
        aria-expanded={context.open}
        // TODO not matching
        // aria-controls={context.contentId}
        data-state={getState(context.open)}
        {...rest}
        // @ts-ignore
        ref={composedTriggerRef}
        onPress={composeEventHandlers(props.onPress as any, context.onOpenToggle)}
      />
    );

    return context.hasCustomAnchor ? (
      trigger
    ) : (
      <PopperAnchor {...popperScope} asChild>
        {trigger}
      </PopperAnchor>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * PopoverContent
 * -----------------------------------------------------------------------------------------------*/

export type PopoverContentProps = PopoverContentTypeProps;

type PopoverContentTypeElement = PopoverContentImplElement;

const CONTENT_NAME = "PopoverContent";
export interface PopoverContentTypeProps
  extends Omit<PopoverContentImplProps, "disableOutsidePointerEvents"> {
  /**
   * @see https://github.com/theKashey/react-remove-scroll#usage
   */
  allowPinchZoom?: RemoveScrollProps["allowPinchZoom"];
}

export const PopoverContent = PopperContentFrame.extractable(
  React.forwardRef<PopoverContentTypeElement, PopoverContentTypeProps>(function PopoverContent(
    props: ScopedProps<PopoverContentTypeProps>,
    forwardedRef,
  ) {
    const {
      allowPinchZoom,
      trapFocus,
      disableRemoveScroll = true,
      zIndex,
      __scopePopover,
      ...contentImplProps
    } = props;
    const context = usePopoverContext(CONTENT_NAME, __scopePopover);
    const contentRef = React.useRef<any>(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const isRightClickOutsideRef = React.useRef(false);

    // aria-hide everything except the content (better supported equivalent to setting aria-modal)
    React.useEffect(() => {
      if (!context.open) return;
      const content = contentRef.current;
      if (content) return hideOthers(content);
    }, [context.open]);

    return (
      <PopoverContentPortal __scopePopover={__scopePopover} zIndex={props.zIndex}>
        <Stack pointerEvents={context.open ? "auto" : "none"}>
          <PopoverContentImpl
            __scopePopover={__scopePopover}
            {...contentImplProps}
            disableRemoveScroll={disableRemoveScroll}
            ref={composedRefs}
            // we make sure we're not trapping once it's been closed
            // (closed !== unmounted when animating out)
            trapFocus={trapFocus ?? context.open}
            disableOutsidePointerEvents
            onCloseAutoFocus={composeEventHandlers(props.onCloseAutoFocus, (event) => {
              event.preventDefault();
              if (!isRightClickOutsideRef.current) context.triggerRef.current?.focus();
            })}
            onPointerDownOutside={composeEventHandlers(
              props.onPointerDownOutside,
              (event) => {
                const originalEvent = event.detail.originalEvent;
                const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
                const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
                isRightClickOutsideRef.current = isRightClick;
              },
              { checkDefaultPrevented: false },
            )}
            // When focus is trapped, a `focusout` event may still happen.
            // We make sure we don't trigger our `onDismiss` in such case.
            onFocusOutside={composeEventHandlers(
              props.onFocusOutside,
              (event) => event.preventDefault(),
              { checkDefaultPrevented: false },
            )}
          />
        </Stack>
      </PopoverContentPortal>
    );
  }),
);

function PopoverRepropagateContext(
  props: ScopedProps<{
    children: any;
    context: any;
  }>,
) {
  const { __scopePopover } = props;
  const popperScope = usePopperScope(__scopePopover);
  return (
    <Popper {...popperScope}>
      <PopoverProvider scope={__scopePopover} {...props.context}>
        {props.children}
      </PopoverProvider>
    </Popper>
  );
}

const POPOVER_CONTENT_PORTAL = "PopoverContentPortal";

function PopoverContentPortal(props: ScopedProps<PopoverContentTypeProps>) {
  const { __scopePopover } = props;
  const zIndex = props.zIndex ?? 150_000;
  const context = usePopoverContext(POPOVER_CONTENT_PORTAL, __scopePopover);
  const themeName = useThemeName();

  let contents = props.children;

  // native doesnt support portals
  if (Platform.OS === "android" || Platform.OS === "ios") {
    contents = (
      <PopoverRepropagateContext __scopePopover={__scopePopover} context={context}>
        {props.children}
      </PopoverRepropagateContext>
    );
  }

  // Portal the contents and add a transparent bg overlay to handle dismiss on native
  return (
    <Portal zIndex={zIndex}>
      <Theme forceClassName name={themeName}>
        {!!context.open && !context.breakpointActive && (
          <YStack
            fullscreen
            onPress={composeEventHandlers(props.onPress as any, context.onOpenToggle)}
          />
        )}
        {contents}
      </Theme>
    </Portal>
  );
}

/* -----------------------------------------------------------------------------------------------*/

type PopoverContentImplElement = React.ElementRef<typeof PopperContent>;

export interface PopoverContentImplProps
  extends PopperContentProps,
    Omit<DismissableProps, "onDismiss" | "children" | "onPointerDownCapture"> {
  /**
   * Whether focus should be trapped within the `Popover`
   * @default false
   */
  trapFocus?: FocusScopeProps["trapped"];

  /**
   * Whether popover should not focus contents on open
   * @default false
   */
  disableFocusScope?: boolean;

  /**
   * Event handler called when auto-focusing on open.
   * Can be prevented.
   */
  onOpenAutoFocus?: FocusScopeProps["onMountAutoFocus"];

  /**
   * Event handler called when auto-focusing on close.
   * Can be prevented.
   */
  onCloseAutoFocus?: FocusScopeProps["onUnmountAutoFocus"];

  disableRemoveScroll?: boolean;

  freezeContentsWhenHidden?: boolean;
}

const POPOVER_CONTENT_IMPL_NAME = "PopoverContentImpl";

const PopoverContentImpl = React.forwardRef<
  PopoverContentImplElement,
  ScopedProps<PopoverContentImplProps>
>(function PopoverContentImpl(props: ScopedProps<PopoverContentImplProps>, forwardedRef) {
  const {
    trapFocus,
    __scopePopover,
    onOpenAutoFocus,
    onCloseAutoFocus,
    disableOutsidePointerEvents,
    disableFocusScope,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    children,
    disableRemoveScroll,
    freezeContentsWhenHidden,
    ...contentProps
  } = props;

  const context = usePopoverContext(POPOVER_CONTENT_IMPL_NAME, __scopePopover);
  const { open, keepChildrenMounted } = context;
  const popperScope = usePopperScope(__scopePopover);
  const [isFullyHidden, setIsFullyHidden] = React.useState(!context.open);

  const contents = React.useMemo(() => {
    return isWeb ? <div style={{ display: "contents" }}>{children}</div> : children;
  }, [children]);

  if (open && isFullyHidden) {
    setIsFullyHidden(false);
  }

  if (!keepChildrenMounted) {
    if (isFullyHidden) {
      return null;
    }
  }

  if (context.breakpointActive) {
    // unwrap the PopoverScrollView if used, as it will use the SheetScrollView if that exists
    // TODO this should be disabled through context
    const childrenWithoutScrollView = React.Children.toArray(children).map((child) => {
      if (React.isValidElement(child)) {
        if (child.type === ScrollView) {
          return child.props.children;
        }
      }
      return child;
    });

    let content = childrenWithoutScrollView as any;

    if (Platform.OS === "android" || Platform.OS === "ios") {
      content = <Popper {...popperScope}>{childrenWithoutScrollView}</Popper>;
    }

    // doesn't show as popover yet on native, must use as sheet
    return <PortalItem hostName={`${context.id}PopoverContents`}>{content}</PortalItem>;
  }

  // const handleDismiss = React.useCallback((event: GestureResponderEvent) =>{
  //   context.onOpenChange(false);
  // }, [])
  // <Dismissable
  //     disableOutsidePointerEvents={disableOutsidePointerEvents}
  //     // onInteractOutside={onInteractOutside}
  //     onEscapeKeyDown={onEscapeKeyDown}
  //     // onPointerDownOutside={onPointerDownOutside}
  //     // onFocusOutside={onFocusOutside}
  //     onDismiss={handleDismiss}
  //   >

  const freeze = Boolean(isFullyHidden && freezeContentsWhenHidden);

  return (
    <Animate
      type="presence"
      present={Boolean(open)}
      keepChildrenMounted={keepChildrenMounted}
      onExitComplete={() => {
        setIsFullyHidden(true);
      }}
    >
      <FreezeToLastContents
        // freeze if fully hidden but fallback to last contents
        // if keepChildrenMounted then mount it on the first
        freeze={freeze}
      >
        <PopperContent
          key={context.contentId}
          data-state={getState(open)}
          id={context.contentId}
          ref={forwardedRef}
          {...popperScope}
          {...contentProps}
        >
          <RemoveScroll
            enabled={disableRemoveScroll ? false : open}
            allowPinchZoom
            // causes lots of bugs on touch web on site
            removeScrollBar={false}
            style={{
              display: "contents",
            }}
          >
            <FocusScope
              loop
              enabled={disableFocusScope ? false : open}
              trapped={trapFocus}
              onMountAutoFocus={onOpenAutoFocus}
              onUnmountAutoFocus={onCloseAutoFocus}
            >
              {contents}
            </FocusScope>
          </RemoveScroll>
        </PopperContent>
      </FreezeToLastContents>
    </Animate>
  );
});

const FreezeToLastContents = (props: { freeze: boolean; children: any }) => {
  const last = React.useRef();

  if (!props.freeze) {
    last.current = props.children;
  }

  return <Freeze placeholder={last.current} {...props} />;
};

/* -------------------------------------------------------------------------------------------------
 * PopoverClose
 * -----------------------------------------------------------------------------------------------*/

export type PopoverCloseProps = YStackProps;

const POPOVER_CLOSE = "PopoverClose";

export const PopoverClose = React.forwardRef<TamaguiElement, ScopedProps<PopoverCloseProps>>(
  function PopoverClose(props, forwardedRef) {
    const { __scopePopover, ...rest } = props;
    const context = usePopoverContext(POPOVER_CLOSE, __scopePopover);
    return (
      <YStack
        {...rest}
        ref={forwardedRef}
        componentName="PopoverClose"
        onPress={composeEventHandlers(props.onPress as any, () => context.onOpenChange(false))}
      />
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * PopoverArrow
 * -----------------------------------------------------------------------------------------------*/

export type PopoverArrowProps = PopperArrowProps;

export const PopoverArrow = React.forwardRef<TamaguiElement, PopoverArrowProps>(
  function PopoverArrow(props: ScopedProps<PopoverArrowProps>, forwardedRef) {
    const { __scopePopover, ...rest } = props;
    const popperScope = usePopperScope(__scopePopover);
    return (
      <PopperArrow {...popperScope} componentName="PopoverArrow" {...rest} ref={forwardedRef} />
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * Popover
 * -----------------------------------------------------------------------------------------------*/

export const Popover = withStaticProperties(
  function Popover(props: ScopedProps<PopoverProps>) {
    const {
      children,
      open: openProp,
      defaultOpen,
      onOpenChange,
      __scopePopover,
      keepChildrenMounted,
      ...restProps
    } = props;

    const id = React.useId();
    const { when, AdaptProvider } = useAdaptParent({
      Contents: React.useCallback(() => {
        return <PortalHost name={`${id}PopoverContents`} />;
      }, []),
    });

    const popperScope = usePopperScope(__scopePopover);

    const sheetBreakpoint = when;
    const triggerRef = React.useRef<TamaguiElement>(null);
    const [hasCustomAnchor, setHasCustomAnchor] = React.useState(false);
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen || false,
      onChange: onOpenChange,
    });

    const breakpointActive = useSheetBreakpointActive(sheetBreakpoint);

    const floatingContext = useFloatingContext({ open, setOpen, breakpointActive }) as any;

    const popoverContext = {
      id,
      sheetBreakpoint,
      contentId: React.useId(),
      triggerRef,
      open,
      breakpointActive,
      scope: __scopePopover,
      onOpenChange: setOpen,
      onOpenToggle: useEvent(() => {
        if (open && breakpointActive) {
          return;
        }
        setOpen(!open);
      }),
      hasCustomAnchor,
      onCustomAnchorAdd: React.useCallback(() => setHasCustomAnchor(true), []),
      onCustomAnchorRemove: React.useCallback(() => setHasCustomAnchor(false), []),
      keepChildrenMounted,
    };

    // debug if changing too often
    // if (process.env.NODE_ENV === 'development') {
    //   Object.keys(popoverContext).forEach((key) => {
    //     React.useEffect(() => console.log(`changed`, key), [popoverContext[key]])
    //   })
    // }

    const contents = (
      <Popper {...popperScope} stayInFrame {...restProps}>
        <PopoverProvider {...popoverContext}>
          <PopoverSheetController onOpenChange={setOpen}>{children}</PopoverSheetController>
        </PopoverProvider>
      </Popper>
    );

    return (
      <AdaptProvider>
        {isWeb ? (
          <FloatingOverrideContext.Provider value={floatingContext}>
            {contents}
          </FloatingOverrideContext.Provider>
        ) : (
          contents
        )}
      </AdaptProvider>
    );
  } as React.FC<PopoverProps>,
  {
    Anchor: PopoverAnchor,
    Arrow: PopoverArrow,
    Trigger: PopoverTrigger,
    Content: PopoverContent,
    Close: PopoverClose,
    Adapt,
    ScrollView: ScrollView,
    Sheet: Sheet.Controlled,
  },
);

/* -----------------------------------------------------------------------------------------------*/

function getState(open: boolean) {
  return open ? "open" : "closed";
}

const POPOVER_SHEET_CONTROLLER = "PopoverSheetController";

const PopoverSheetController = (
  props: ScopedProps<{
    children: React.ReactNode;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  }>,
) => {
  const { __scopePopover } = props;
  const context = usePopoverContext(POPOVER_SHEET_CONTROLLER, __scopePopover);
  const showSheet = useShowPopoverSheet(context);
  const breakpointActive = context.breakpointActive;
  const getShowSheet = useGet(showSheet);

  // TODO: SheetController should also take scope
  return (
    <SheetController
      onOpenChange={(val) => {
        if (getShowSheet()) {
          props.onOpenChange(val);
        }
      }}
      open={context.open}
      hidden={breakpointActive === false}
    >
      {props.children}
    </SheetController>
  );
};

const useSheetBreakpointActive = (breakpoint?: MediaQueryKey | null | boolean) => {
  const media = useMedia();
  if (typeof breakpoint === "boolean" || !breakpoint) {
    return !!breakpoint;
  }
  return media[breakpoint];
};

const useShowPopoverSheet = (context: PopoverContextValue) => {
  const breakpointActive = useSheetBreakpointActive(context.sheetBreakpoint);
  return context.open === false ? false : breakpointActive;
};
