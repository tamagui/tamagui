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
import type { SizeTokens, TamaguiElement } from '@tamagui/core'
import { useEvent } from '@tamagui/core'
import type { UseFloatingFn } from '@tamagui/floating'
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
  PopoverContext,
  PopoverTrigger,
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

const TooltipContent = PopperContentFrame.extractable(
  React.forwardRef<TamaguiElement, TooltipContentProps>((props, ref) => {
    const preventAnimation = React.useContext(PreventTooltipAnimationContext)

    return (
      <PopoverContent
        scope={props.scope || TOOLTIP_SCOPE}
        componentName="Tooltip"
        disableFocusScope
        {...(!props.unstyled && {
          pointerEvents: 'none',
        })}
        ref={ref}
        {...props}
        {...(preventAnimation && {
          animation: null,
        })}
      />
    )
  })
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
  }
>

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
  props: TooltipProps,
  // no real ref here but React complaining need to see why see SandboxCustomStyledAnimatedTooltip.ts
  ref
) {
  const {
    children,
    delay: delayProp = 400,
    restMs = typeof delayProp === 'undefined'
      ? 0
      : typeof delayProp === 'number'
        ? delayProp
        : 0,
    onOpenChange: onOpenChangeProp,
    focus,
    open: openProp,
    disableAutoCloseOnScroll,
    scope = TOOLTIP_SCOPE,
    ...restProps
  } = props
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [hasCustomAnchor, setHasCustomAnchor] = React.useState(false)
  const { delay: delayGroup, setCurrentId } = useDelayGroupContext()
  const delay = delayProp ?? delayGroup ?? 0
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

  const useFloatingFn: UseFloatingFn = (props) => {
    // @ts-ignore
    const floating = useFloating({
      ...props,
      open,
      onOpenChange,
    })
    const { delay: delayContext } = useDelayGroup(floating.context, { id })
    const delayOut = delay ?? delayContext

    const { getReferenceProps, getFloatingProps } = useInteractions([
      useHover(floating.context, {
        delay: delayOut,
        restMs,
      }),
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
        scope={scope}
        size={smallerSize?.key as SizeTokens}
        allowFlip
        stayInFrame
        open={open}
        {...restProps}
      >
        <PopoverContext.Provider
          popoverScope={scope}
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
        </PopoverContext.Provider>
      </Popper>
    </FloatingOverrideContext.Provider>
  )
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
