import '@tamagui/polyfill-dev'

import { FloatingDelayGroup, useDelayGroupContext, type Delay } from '@tamagui/floating'
import type { SizeTokens, TamaguiElement } from '@tamagui/core'
import { useEvent } from '@tamagui/core'
import { FloatingOverrideContext } from '@tamagui/floating'
import { getSize } from '@tamagui/get-token'
import { withStaticProperties } from '@tamagui/helpers'
import type {
  PopoverAnchorProps,
  PopoverContentProps,
  PopoverTriggerProps,
} from '@tamagui/popover'
import {
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
  PopoverContextProvider,
  PopoverTrigger,
  useFloatingContext,
} from '@tamagui/popover'
import type { PopperArrowProps, PopperProps } from '@tamagui/popper'
import { Popper, PopperContentFrame } from '@tamagui/popper'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'

const TOOLTIP_SCOPE = ''

export type TooltipScopes = string

type ScopedProps<P> = Omit<P, 'scope'> & { scope?: TooltipScopes }

export type TooltipContentProps = ScopedProps<PopoverContentProps>

// warning: setting to stylebale causes issues with themeInverse across portal root

// performance: avoid 2 components we never use
const ALWAYS_DISABLE_TOOLTIP = {
  focus: true,
  'remove-scroll': true,
  // it's nice to hit escape to hide a tooltip
  // dismiss: true
} as const

const TooltipContent = PopperContentFrame.styleable<TooltipContentProps>(
  (props, ref) => {
    const preventAnimation = React.useContext(PreventTooltipAnimationContext)
    const zIndexFromContext = React.useContext(TooltipZIndexContext)

    return (
      <PopoverContent
        scope={props.scope || TOOLTIP_SCOPE}
        alwaysDisable={ALWAYS_DISABLE_TOOLTIP}
        {...(!props.unstyled && {
          backgroundColor: '$background',
          alignItems: 'center',
          pointerEvents: 'none',
          size: '$true',
        })}
        ref={ref}
        // zIndex from root Tooltip prop flows to portal
        {...(zIndexFromContext !== undefined && { zIndex: zIndexFromContext })}
        {...props}
        {...(preventAnimation && {
          transition: null,
        })}
      />
    )
  },
  {
    staticConfig: {
      componentName: 'Tooltip',
    },
  }
)

const TooltipArrow = React.forwardRef<TamaguiElement, PopperArrowProps>((props, ref) => {
  return (
    <PopoverArrow
      scope={props.scope || TOOLTIP_SCOPE}
      componentName="Tooltip"
      ref={ref}
      {...props}
    />
  )
})

export type TooltipProps = ScopedProps<
  PopperProps & {
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
    /**
     * z-index for the tooltip portal. Use this when tooltips need to appear
     * above other portaled content like dialogs.
     */
    zIndex?: number
  }
>

const PreventTooltipAnimationContext = React.createContext(false)
const TooltipZIndexContext = React.createContext<number | undefined>(undefined)

export const TooltipGroup = ({
  children,
  delay,
  preventAnimation = false,
  timeoutMs,
}: {
  children?: any
  delay: Delay
  preventAnimation?: boolean
  timeoutMs?: number
}) => {
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
  props: TooltipProps,
  // no real ref here but React complaining need to see why see SandboxCustomStyledAnimatedTooltip.ts
  ref
) {
  // hooks inside useFloatingFn confuse the React Compiler
  'use no memo'

  const {
    children,
    delay: delayProp,
    restMs: restMsProp,
    onOpenChange: onOpenChangeProp,
    focus,
    open: openProp,
    disableAutoCloseOnScroll,
    zIndex,
    scope = TOOLTIP_SCOPE,
    ...restProps
  } = props
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [hasCustomAnchor, setHasCustomAnchor] = React.useState(false)
  const { delay: delayGroup, setCurrentId } = useDelayGroupContext()
  // Use delayProp if explicitly provided, otherwise fall back to group delay or default 400
  const delay = delayProp !== undefined ? delayProp : (delayGroup ?? 400)
  const restMs = restMsProp ?? (typeof delay === 'number' ? delay : 0)
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: false,
    onChange: onOpenChangeProp,
  })
  const id = props.groupId

  const onOpenChange = useEvent((open: boolean) => {
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
    const closeIt = () => {
      setOpen(false)
    }
    setOpens.add(setOpen)
    document.documentElement.addEventListener('scroll', closeIt)
    return () => {
      setOpens.delete(setOpen)
      document.documentElement.removeEventListener('scroll', closeIt)
    }
  }, [open, disableAutoCloseOnScroll])

  // use the shared floating context from popover — gives us multi-trigger
  // hover coordination (onHoverReference/onLeaveReference + grace period)
  // and safePolygon for free
  const floatingContext = useFloatingContext({
    open,
    setOpen: onOpenChange,
    disable: false,
    disableFocus: false,
    hoverable: true,
    role: 'tooltip',
    focus,
    groupId: id,
    delay,
    restMs,
  })

  const onCustomAnchorAdd = React.useCallback(() => setHasCustomAnchor(true), [])
  const onCustomAnchorRemove = React.useCallback(() => setHasCustomAnchor(false), [])
  const contentId = React.useId()
  const smallerSize = props.unstyled
    ? null
    : getSize('$true', {
        shift: -2,
        bounds: [0],
      })

  const content = (
    <FloatingOverrideContext.Provider value={floatingContext}>
      {/* default tooltip to a smaller size */}
      <Popper
        scope={scope}
        size={smallerSize?.key as SizeTokens}
        allowFlip
        stayInFrame
        open={open}
        {...restProps}
      >
        <PopoverContextProvider
          scope={scope}
          contentId={contentId}
          triggerRef={triggerRef}
          open={open}
          onOpenChange={setOpen}
          onOpenToggle={voidFn}
          hasCustomAnchor={hasCustomAnchor}
          onCustomAnchorAdd={onCustomAnchorAdd}
          onCustomAnchorRemove={onCustomAnchorRemove}
        >
          {children}
        </PopoverContextProvider>
      </Popper>
    </FloatingOverrideContext.Provider>
  )

  if (zIndex !== undefined) {
    return (
      <TooltipZIndexContext.Provider value={zIndex}>
        {content}
      </TooltipZIndexContext.Provider>
    )
  }

  return content
})

const TooltipTrigger = React.forwardRef(function TooltipTrigger(
  props: ScopedProps<PopoverTriggerProps>,
  ref: any
) {
  const { scope, ...rest } = props
  return <PopoverTrigger {...rest} scope={scope || TOOLTIP_SCOPE} ref={ref} />
})

const TooltipAnchor = React.forwardRef(function TooltipAnchor(
  props: ScopedProps<PopoverAnchorProps>,
  ref: any
) {
  const { scope, ...rest } = props
  return <PopoverAnchor {...rest} scope={scope || TOOLTIP_SCOPE} ref={ref} />
})

export const Tooltip = withStaticProperties(TooltipComponent, {
  Anchor: TooltipAnchor,
  Arrow: TooltipArrow,
  Content: TooltipContent,
  Trigger: TooltipTrigger,
})

const voidFn = () => {}
