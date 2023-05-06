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
import { SizeTokens, useEvent, withStaticProperties } from '@tamagui/core'
import { ScopedProps } from '@tamagui/create-context'
import { FloatingOverrideContext, UseFloatingFn } from '@tamagui/floating'
import { stepTokenUpOrDown } from '@tamagui/get-size'
import {
  PopoverAnchor,
  PopoverArrow,
  PopoverArrowProps,
  PopoverContent,
  PopoverContentProps,
  PopoverTrigger,
  __PopoverProviderInternal,
  usePopoverScope,
} from '@tamagui/popover'
import {
  Popper,
  PopperContentFrame,
  PopperProps,
  usePopperContext,
} from '@tamagui/popper'
import * as React from 'react'

const TooltipContent = PopperContentFrame.extractable(
  React.forwardRef(
    (
      { __scopePopover, ...props }: ScopedProps<PopoverContentProps, 'Popover'>,
      ref: any
    ) => {
      const popperScope = usePopoverScope(__scopePopover)
      const popper = usePopperContext('PopperContent', popperScope['__scopePopper'])
      const padding = props.size || popper.size || stepTokenUpOrDown('size', '$true', -2)
      return (
        <PopoverContent
          componentName="Tooltip"
          disableRemoveScroll
          trapFocus={false}
          padding={padding}
          pointerEvents="none"
          ref={ref}
          {...props}
        />
      )
    }
  )
)

const TooltipArrow = React.forwardRef((props: PopoverArrowProps, ref: any) => {
  return <PopoverArrow componentName="Tooltip" ref={ref} {...props} />
})

export type TooltipProps = PopperProps & {
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
  props: ScopedProps<TooltipProps, 'Popover'>,
  // theres no real ref here but React complaining need to see why see SandboxCustomStyledAnimatedTooltip.ts
  ref
) {
  const {
    __scopePopover,
    children,
    delay: delayProp,
    restMs = typeof delayProp === 'undefined'
      ? 500
      : typeof delayProp === 'number'
      ? delayProp
      : 0,
    onOpenChange: onOpenChangeProp,
    focus,
    ...restProps
  } = props
  const popperScope = usePopoverScope(__scopePopover)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [hasCustomAnchor, setHasCustomAnchor] = React.useState(false)
  const { delay: delayGroup, setCurrentId } = useDelayGroupContext()
  const delay = delayProp ?? delayGroup
  const [open, setOpen] = React.useState(false)
  const id = props.groupId

  const onOpenChange = useEvent((open) => {
    setOpen(open)
    if (open) {
      setCurrentId(id)
    }
    onOpenChangeProp?.(open)
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
      getReferenceProps,
      getFloatingProps,
    } as any
  }

  const useFloatingContext = React.useCallback(useFloatingFn, [id, delay, open])
  const onCustomAnchorAdd = React.useCallback(() => setHasCustomAnchor(true), [])
  const onCustomAnchorRemove = React.useCallback(() => setHasCustomAnchor(false), [])
  const contentId = React.useId()
  const twoSmallerKey = stepTokenUpOrDown('size', '$true', -2).key
  const size = `$${twoSmallerKey}`

  return (
    <FloatingOverrideContext.Provider value={useFloatingContext}>
      {/* default tooltip to a smaller size */}
      <Popper size={size as SizeTokens} allowFlip {...popperScope} {...restProps}>
        <__PopoverProviderInternal
          scope={__scopePopover}
          popperScope={popperScope.__scopePopper}
          contentId={contentId}
          triggerRef={triggerRef}
          sheetBreakpoint={false}
          scopeKey=""
          open={open}
          onOpenChange={setOpen}
          onOpenToggle={voidFn}
          hasCustomAnchor={hasCustomAnchor}
          onCustomAnchorAdd={onCustomAnchorAdd}
          onCustomAnchorRemove={onCustomAnchorRemove}
        >
          {children}
        </__PopoverProviderInternal>
      </Popper>
    </FloatingOverrideContext.Provider>
  )
})

export const Tooltip = withStaticProperties(TooltipComponent, {
  Anchor: PopoverAnchor,
  Arrow: TooltipArrow,
  Content: TooltipContent,
  Trigger: PopoverTrigger,
})

const voidFn = () => {}
