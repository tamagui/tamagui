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
import type { ScopedProps, SizeTokens } from '@tamagui/core'
import { useEvent } from '@tamagui/core'
import type { UseFloatingFn } from '@tamagui/floating'
import { FloatingOverrideContext } from '@tamagui/floating'
import { getSize } from '@tamagui/get-token'
import { withStaticProperties } from '@tamagui/helpers'
import type {
  PopoverAnchorProps,
  PopoverArrowProps,
  PopoverContentProps,
  PopoverTriggerProps,
} from '@tamagui/popover'
import {
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
  PopoverContext,
  PopoverTrigger,
} from '@tamagui/popover'
import type { PopperProps } from '@tamagui/popper'
import { Popper, PopperContentFrame, usePopperContext } from '@tamagui/popper'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'

const TOOLTIP_SCOPE = 'tooltip'
type ScopedTooltipProps<P> = ScopedProps<P, 'Tooltip'>

const TooltipContent = PopperContentFrame.extractable(
  React.forwardRef(
    ({ __scopeTooltip, ...props }: ScopedTooltipProps<PopoverContentProps>, ref: any) => {
      const preventAnimation = React.useContext(PreventTooltipAnimationContext)
      const popper = usePopperContext(__scopeTooltip || TOOLTIP_SCOPE)
      const padding = !props.unstyled
        ? (props.padding ??
          props.size ??
          popper.size ??
          getSize('$true', {
            shift: -2,
          }))
        : undefined

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
          {...(preventAnimation && {
            animation: null,
          })}
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
        __scopePopper={__scopeTooltip || TOOLTIP_SCOPE}
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
    visibleOnly?: boolean
  }
  groupId?: string
  restMs?: number
  delay?:
    | number
    | {
        open?: number
        close?: number
      }
  disableAutoCloseOnScroll?: boolean
}

type Delay =
  | number
  | Partial<{
      open: number
      close: number
    }>

const PreventTooltipAnimationContext = React.createContext(false)

export const TooltipGroup = ({
  children,
  delay,
  preventAnimation = false,
  timeoutMs,
}: { children?: any; delay: Delay; preventAnimation?: boolean; timeoutMs?: number }) => {
  return (
    <PreventTooltipAnimationContext.Provider value={preventAnimation}>
      <FloatingDelayGroup
        timeoutMs={timeoutMs}
        delay={React.useMemo(() => delay, [JSON.stringify(delay)])}
      >
        {children}
      </FloatingDelayGroup>
    </PreventTooltipAnimationContext.Provider>
  )
}

const setOpens = new Set<React.Dispatch<React.SetStateAction<boolean>>>()

export const closeOpenTooltips = () => {
  setOpens.forEach((x) => x(false))
}

const TooltipComponent = React.forwardRef(function Tooltip(
  props: ScopedTooltipProps<TooltipProps>,
  // no real ref here but React complaining need to see why see SandboxCustomStyledAnimatedTooltip.ts
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
    disableAutoCloseOnScroll,
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

  // Auto close when document scroll
  React.useEffect(() => {
    if (!open) return
    if (disableAutoCloseOnScroll) return
    if (typeof document === 'undefined') return
    const openIt = () => {
      setOpen(false)
    }
    setOpens.add(setOpen)
    document.documentElement.addEventListener('scroll', openIt)
    return () => {
      setOpens.delete(setOpen)
      document.documentElement.removeEventListener('scroll', openIt)
    }
  }, [open, disableAutoCloseOnScroll])

  const useFloatingFn: UseFloatingFn = (props) => {
    // @ts-ignore
    const floating = useFloating({
      ...props,
      open,
      onOpenChange,
    })
    const { delay: delayContext } = useDelayGroup(floating.context, { id })
    const { getReferenceProps, getFloatingProps } = useInteractions([
      useHover(floating.context, { delay: delay ?? delayContext, restMs }),
      useFocus(floating.context, focus),
      useRole(floating.context, { role: 'tooltip' }),
      useDismiss(floating.context),
    ])
    return {
      ...floating,
      open,
      getReferenceProps,
      getFloatingProps,
    } as any
  }

  const useFloatingContext = React.useCallback(useFloatingFn, [
    id,
    delay,
    open,
    restMs,
    focus ? JSON.stringify(focus) : 0,
  ])
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
