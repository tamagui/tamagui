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
import { useId, withStaticProperties } from '@tamagui/core'
import { ScopedProps } from '@tamagui/create-context'
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
import { FloatingOverrideContext, Popper, PopperProps, UseFloatingFn } from '@tamagui/popper'
import { SizableStackProps } from '@tamagui/stacks'
import { Paragraph } from '@tamagui/text'
import * as React from 'react'

const TooltipContent = React.forwardRef((props: PopoverContentProps, ref: any) => {
  return <PopoverContent componentName="TooltipContent" pointerEvents="none" ref={ref} {...props} />
})

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

export const TooltipGroup = FloatingDelayGroup

export const Tooltip = withStaticProperties(
  ((props: ScopedProps<TooltipProps, 'Popover'>) => {
    const { __scopePopover, children, restMs = 500, delay: delayProp, ...restProps } = props
    const popperScope = usePopoverScope(__scopePopover)
    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const [hasCustomAnchor, setHasCustomAnchor] = React.useState(false)
    const { delay: delayGroup, setCurrentId } = useDelayGroupContext()
    const delay = delayProp ?? delayGroup
    const [open, setOpen] = React.useState(false)
    const id = props.groupId

    const onOpenChange = React.useCallback(
      (open) => {
        setOpen(open)
        if (open) {
          setCurrentId(id)
        }
        props.onOpenChange?.(open)
      },
      [id, setCurrentId]
    )

    const useFloatingFn: UseFloatingFn = (props) => {
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

    const voidFn = React.useCallback(() => {}, [setOpen])

    return (
      <FloatingOverrideContext.Provider value={useFloatingContext}>
        {/* default tooltip to a smaller size */}
        <Popper size="$2" {...popperScope} {...restProps}>
          <__PopoverProviderInternal
            scope={__scopePopover}
            contentId={useId()}
            triggerRef={triggerRef}
            open={open}
            onOpenChange={setOpen}
            onOpenToggle={voidFn}
            hasCustomAnchor={hasCustomAnchor}
            onCustomAnchorAdd={React.useCallback(() => setHasCustomAnchor(true), [])}
            onCustomAnchorRemove={React.useCallback(() => setHasCustomAnchor(false), [])}
            modal
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

export type TooltipSimpleProps = TooltipProps & {
  label?: React.ReactNode
  children?: React.ReactNode
  contentProps?: SizableStackProps
}

export const TooltipSimple: React.FC<TooltipSimpleProps> = ({
  label,
  children,
  contentProps,
  ...tooltipProps
}) => {
  let context
  try {
    context = useDelayGroupContext()
  } catch {
    // ok
  }

  const contents = (
    <Tooltip {...tooltipProps}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Content
        enterStyle={{ x: 0, y: -10, opacity: 0, scale: 0.9 }}
        exitStyle={{ x: 0, y: -10, opacity: 0, scale: 0.9 }}
        x={0}
        scale={1}
        y={0}
        elevation="$1"
        opacity={1}
        animation={[
          'bouncy',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        {...contentProps}
      >
        <Tooltip.Arrow />
        <Paragraph size="$2">{label}</Paragraph>
      </Tooltip.Content>
    </Tooltip>
  )

  if (!context) {
    return <TooltipGroup delay={{ open: 3000, close: 100 }}>{contents}</TooltipGroup>
  }

  return contents
}
