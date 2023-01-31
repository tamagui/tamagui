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
} from '@floating-ui/react-dom-interactions'
import { useEvent, useId, withStaticProperties } from '@tamagui/core'
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
import { Popper, PopperProps, usePopperContext } from '@tamagui/popper'
import * as React from 'react'

const TooltipContent = React.forwardRef(
  (
    { __scopePopover, ...props }: ScopedProps<PopoverContentProps, 'Popover'>,
    ref: any
  ) => {
    const popperScope = usePopoverScope(__scopePopover)
    const popper = usePopperContext('PopperContent', popperScope['__scopePopper'])
    return (
      <PopoverContent
        componentName="TooltipContent"
        disableRemoveScroll
        trapFocus={false}
        padding={props.size || popper.size || '$2'}
        pointerEvents="none"
        ref={ref}
        {...props}
      />
    )
  }
)

const TooltipArrow = React.forwardRef((props: PopoverArrowProps, ref: any) => {
  return <PopoverArrow componentName="TooltipArrow" ref={ref} {...props} />
})

export type TooltipProps = PopperProps & {
  children?: React.ReactNode
  onOpenChange?: (open: boolean) => void
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

export const Tooltip = withStaticProperties(
  ((props: ScopedProps<TooltipProps, 'Popover'>) => {
    const {
      __scopePopover,
      children,
      restMs = 500,
      delay: delayProp,
      onOpenChange: onOpenChangeProp,
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
        useFocus(floating.context),
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
    const contentId = useId()
    const size = `$${(stepTokenUpOrDown('size', '$true', -2) as any).key}` as any

    return (
      <FloatingOverrideContext.Provider value={useFloatingContext}>
        {/* default tooltip to a smaller size */}
        <Popper size={size} {...popperScope} {...restProps}>
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
  }) as React.FC<TooltipProps>,
  {
    Anchor: PopoverAnchor,
    Arrow: TooltipArrow,
    Content: TooltipContent,
    Trigger: PopoverTrigger,
  }
)

Tooltip.displayName = 'Tooltip'

const voidFn = () => {}
