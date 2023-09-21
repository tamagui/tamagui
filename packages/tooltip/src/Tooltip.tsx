import '@tamagui/polyfill-dev'

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
} from '@floating-ui/react'
import { ScopedProps, SizeTokens, useEvent, withStaticProperties } from '@tamagui/core'
import { FloatingOverrideContext, UseFloatingFn } from '@tamagui/floating'
import { getSize } from '@tamagui/get-token'
import {
  PopoverAnchor,
  PopoverAnchorProps,
  PopoverArrow,
  PopoverArrowProps,
  PopoverContent,
  PopoverContentProps,
  PopoverContext,
  PopoverTrigger,
  PopoverTriggerProps,
} from '@tamagui/popover'
import {
  Popper,
  PopperContentFrame,
  PopperProps,
  usePopperContext,
} from '@tamagui/popper'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'

const TOOLTIP_SCOPE = 'tooltip'
type ScopedTooltipProps<P> = ScopedProps<P, 'Tooltip'>

const TooltipContent = PopperContentFrame.extractable(
  React.forwardRef(
    ({ __scopeTooltip, ...props }: ScopedTooltipProps<PopoverContentProps>, ref: any) => {
      const popper = usePopperContext(__scopeTooltip || TOOLTIP_SCOPE)
      const padding =
        props.padding ??
        props.size ??
        popper.size ??
        getSize('$true', {
          shift: -2,
        })

      return (
        <PopoverContent
          __scopePopover={__scopeTooltip || TOOLTIP_SCOPE}
          componentName="Tooltip"
          disableRemoveScroll
          disableFocusScope
          {...(!props.unstyled && {
            padding,
          })}
          ref={ref}
          {...props}
        />
      )
    }
  )
)

const TooltipArrow = React.forwardRef(
  (props: ScopedTooltipProps<PopoverArrowProps>, ref: any) => {
    const { __scopeTooltip, ...rest } = props
    return (
      <PopoverArrow
        __scopePopover={__scopeTooltip || TOOLTIP_SCOPE}
        componentName="Tooltip"
        ref={ref}
        {...rest}
      />
    )
  }
)

export type TooltipProps = PopperProps & {
  open?: boolean
  unstyled?: boolean
  children?: React.ReactNode
  onOpenChange?: (open: boolean) => void
  focus?: {
    enabled?: boolean
    keyboardOnly?: boolean
  }
  groupId?: string
  restMs?: number
  delay?:
    | number
    | {
        open?: number
        close?: number
      }
}

type Delay =
  | number
  | Partial<{
      open: number
      close: number
    }>

export const TooltipGroup = ({ children, delay }: { children?: any; delay: Delay }) => {
  return (
    <FloatingDelayGroup delay={React.useMemo(() => delay, [JSON.stringify(delay)])}>
      {children}
    </FloatingDelayGroup>
  )
}

const TooltipComponent = React.forwardRef(function Tooltip(
  props: ScopedTooltipProps<TooltipProps>,
  // theres no real ref here but React complaining need to see why see SandboxCustomStyledAnimatedTooltip.ts
  ref
) {
  const {
    children,
    delay: delayProp,
    restMs = typeof delayProp === 'undefined'
      ? 500
      : typeof delayProp === 'number'
      ? delayProp
      : 0,
    onOpenChange: onOpenChangeProp,
    focus,
    open: openProp,
    __scopeTooltip,
    ...restProps
  } = props
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [hasCustomAnchor, setHasCustomAnchor] = React.useState(false)
  const { delay: delayGroup, setCurrentId } = useDelayGroupContext()
  const delay = delayProp ?? delayGroup
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: false,
    onChange: onOpenChangeProp,
  })
  const id = props.groupId

  const onOpenChange = useEvent((open) => {
    if (open) {
      setCurrentId(id)
    }
    setOpen(open)
  })

  const useFloatingFn: UseFloatingFn = (props) => {
    // @ts-ignore
    const floating = useFloating({
      ...props,
      open,
      onOpenChange,
    })
    const { getReferenceProps, getFloatingProps } = useInteractions([
      useHover(floating.context, { delay, restMs }),
      useFocus(floating.context, focus),
      useRole(floating.context, { role: 'tooltip' }),
      useDismiss(floating.context),
      useDelayGroup(floating.context, { id }),
    ])
    return {
      ...floating,
      open,
      getReferenceProps,
      getFloatingProps,
    } as any
  }

  const useFloatingContext = React.useCallback(useFloatingFn, [id, delay, open])
  const onCustomAnchorAdd = React.useCallback(() => setHasCustomAnchor(true), [])
  const onCustomAnchorRemove = React.useCallback(() => setHasCustomAnchor(false), [])
  const contentId = React.useId()
  const smallerSize = props.unstyled
    ? null
    : getSize('$true', {
        shift: -2,
        bounds: [0],
      })

  return (
    // TODO: FloatingOverrideContext might also need to be scoped
    <FloatingOverrideContext.Provider value={useFloatingContext}>
      {/* default tooltip to a smaller size */}
      <Popper
        __scopePopper={__scopeTooltip || TOOLTIP_SCOPE}
        size={smallerSize?.key as SizeTokens}
        allowFlip
        stayInFrame
        {...restProps}
      >
        <PopoverContext.Provider
          contentId={contentId}
          triggerRef={triggerRef}
          sheetBreakpoint={false}
          open={open}
          scope={__scopeTooltip || TOOLTIP_SCOPE}
          onOpenChange={setOpen}
          onOpenToggle={voidFn}
          hasCustomAnchor={hasCustomAnchor}
          onCustomAnchorAdd={onCustomAnchorAdd}
          onCustomAnchorRemove={onCustomAnchorRemove}
        >
          {children}
        </PopoverContext.Provider>
      </Popper>
    </FloatingOverrideContext.Provider>
  )
})

const TooltipTrigger = React.forwardRef(function TooltipTrigger(
  props: ScopedTooltipProps<PopoverTriggerProps>,
  ref: any
) {
  const { __scopeTooltip, ...rest } = props
  return (
    <PopoverTrigger
      {...rest}
      __scopePopover={__scopeTooltip || TOOLTIP_SCOPE}
      ref={ref}
    />
  )
})

const TooltipAnchor = React.forwardRef(function TooltipAnchor(
  props: ScopedTooltipProps<PopoverAnchorProps>,
  ref: any
) {
  const { __scopeTooltip, ...rest } = props
  return (
    <PopoverAnchor {...rest} __scopePopover={__scopeTooltip || TOOLTIP_SCOPE} ref={ref} />
  )
})

export const Tooltip = withStaticProperties(TooltipComponent, {
  Anchor: TooltipAnchor,
  Arrow: TooltipArrow,
  Content: TooltipContent,
  Trigger: TooltipTrigger,
})

const voidFn = () => {}
