import "@tamagui/polyfill-dev";

import {
  FloatingDelayGroup,
  useDelayGroup,
  useDelayGroupContext,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { SizeTokens, useEvent, withStaticProperties } from "@tamagui/core";
import { ScopedProps } from "@tamagui/create-context";
import { FloatingOverrideContext, UseFloatingFn } from "@tamagui/floating";
import { getSize } from "@tamagui/get-token";
import {
  PopoverAnchor,
  PopoverAnchorProps,
  PopoverArrow,
  PopoverArrowProps,
  PopoverContent,
  PopoverContentProps,
  PopoverProvider,
  PopoverTrigger,
  PopoverTriggerProps,
  createPopoverScope,
} from "@tamagui/popover";
import {
  Popper,
  PopperContentFrame,
  PopperProps,
  createPopperScope,
  usePopperContext,
} from "@tamagui/popper";
import { useControllableState } from "@tamagui/use-controllable-state";
import * as React from "react";

const usePopperScope = createPopperScope();
const usePopoverScope = createPopoverScope();

const TooltipContent = PopperContentFrame.extractable(
  React.forwardRef(
    ({ __scopePopover, ...props }: ScopedProps<PopoverContentProps, "Popover">, ref: any) => {
      const popoverScope = usePopoverScope(undefined);
      const popperScope = usePopperScope(popoverScope["__scopePopover"]);
      const popper = usePopperContext("Tooltip", popperScope["__scopePopper"]);
      const padding =
        props.padding ??
        props.size ??
        popper.size ??
        getSize("$true", {
          shift: -2,
        });

      return (
        <PopoverContent
          componentName="Tooltip"
          disableRemoveScroll
          {...popoverScope}
          disableFocusScope
          {...(!props.unstyled && {
            padding,
          })}
          ref={ref}
          {...props}
        />
      );
    },
  ),
);

const TooltipArrow = React.forwardRef((props: PopoverArrowProps, ref: any) => {
  const popoverScope = usePopoverScope(undefined);
  return <PopoverArrow {...popoverScope} componentName="Tooltip" ref={ref} {...props} />;
});

const TooltipAnchor = React.forwardRef((props: PopoverAnchorProps, ref: any) => {
  const popoverScope = usePopoverScope(undefined);
  return <PopoverAnchor {...popoverScope} componentName="Tooltip" ref={ref} {...props} />;
});

const TooltipTrigger = React.forwardRef((props: PopoverTriggerProps, ref: any) => {
  const popoverScope = usePopoverScope(undefined);
  return <PopoverTrigger {...popoverScope} componentName="Tooltip" ref={ref} {...props} />;
});

export type TooltipProps = PopperProps & {
  open?: boolean;
  unstyled?: boolean;
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  focus?: {
    enabled?: boolean;
    keyboardOnly?: boolean;
  };
  groupId?: string;
  restMs?: number;
  delay?:
    | number
    | {
        open?: number;
        close?: number;
      };
};

type Delay =
  | number
  | Partial<{
      open: number;
      close: number;
    }>;

export const TooltipGroup = ({ children, delay }: { children?: any; delay: Delay }) => {
  return (
    <FloatingDelayGroup delay={React.useMemo(() => delay, [JSON.stringify(delay)])}>
      {children}
    </FloatingDelayGroup>
  );
};

const TooltipComponent = React.forwardRef(function Tooltip(
  props: ScopedProps<TooltipProps, "Popover">,
  // theres no real ref here but React complaining need to see why see SandboxCustomStyledAnimatedTooltip.ts
  ref,
) {
  const {
    __scopePopover,
    children,
    delay: delayProp,
    restMs = typeof delayProp === "undefined" ? 500 : typeof delayProp === "number" ? delayProp : 0,
    onOpenChange: onOpenChangeProp,
    focus,
    open: openProp,
    ...restProps
  } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [hasCustomAnchor, setHasCustomAnchor] = React.useState(false);
  const { delay: delayGroup, setCurrentId } = useDelayGroupContext();
  const delay = delayProp ?? delayGroup;
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: false,
    onChange: onOpenChangeProp,
  });
  const id = props.groupId;

  const onOpenChange = useEvent((open) => {
    if (open) {
      setCurrentId(id);
    }
    setOpen(open);
  });

  const useFloatingFn: UseFloatingFn = (props) => {
    // @ts-ignore
    const floating = useFloating({
      ...props,
      open,
      onOpenChange,
    });
    const { getReferenceProps, getFloatingProps } = useInteractions([
      useHover(floating.context, { delay, restMs }),
      useFocus(floating.context, focus),
      useRole(floating.context, { role: "tooltip" }),
      useDismiss(floating.context),
      useDelayGroup(floating.context, { id }),
    ]);
    return {
      ...floating,
      open,
      getReferenceProps,
      getFloatingProps,
    } as any;
  };

  const useFloatingContext = React.useCallback(useFloatingFn, [id, delay, open]);
  const onCustomAnchorAdd = React.useCallback(() => setHasCustomAnchor(true), []);
  const onCustomAnchorRemove = React.useCallback(() => setHasCustomAnchor(false), []);
  const popoverScope = usePopoverScope(undefined);
  const popperScope = usePopperScope(popoverScope["__scopePopover"]);
  const contentId = React.useId();
  const smallerSize = props.unstyled
    ? null
    : getSize("$true", {
        shift: -2,
        bounds: [0],
      });

  return (
    <FloatingOverrideContext.Provider value={useFloatingContext}>
      {/* default tooltip to a smaller size */}
      <Popper
        __scopePopper={popperScope["__scopePopper"]}
        size={smallerSize?.key as SizeTokens}
        allowFlip
        stayInFrame
        {...restProps}
      >
        <PopoverProvider
          id={contentId}
          scope={popoverScope["__scopePopover"]}
          contentId={contentId}
          triggerRef={triggerRef}
          sheetBreakpoint={false}
          open={open}
          onOpenChange={setOpen}
          onOpenToggle={voidFn}
          hasCustomAnchor={hasCustomAnchor}
          onCustomAnchorAdd={onCustomAnchorAdd}
          onCustomAnchorRemove={onCustomAnchorRemove}
        >
          {children}
        </PopoverProvider>
      </Popper>
    </FloatingOverrideContext.Provider>
  );
});

export const Tooltip = withStaticProperties(TooltipComponent, {
  Anchor: TooltipAnchor,
  Arrow: TooltipArrow,
  Content: TooltipContent,
  Trigger: TooltipTrigger,
});

const voidFn = () => {};
