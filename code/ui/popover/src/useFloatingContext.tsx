import React from 'react'
import type { UseFloatingOptions } from '@floating-ui/react'
import {
  safePolygon,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react'

// Custom floating context to override the Popper on web
export const useFloatingContext = ({
  open,
  setOpen,
  disable,
  disableFocus,
  hoverable,
}) => {
  return React.useCallback(
    (props: UseFloatingOptions) => {
      const floating = useFloating({
        ...props,
        open,
        onOpenChange: (val, event) => {
          const type =
            event?.type === 'mousemove' ||
            event?.type === 'mouseenter' ||
            event?.type === 'mouseleave'
              ? 'hover'
              : 'press'
          setOpen(val, type)
        },
      }) as any
      const { getReferenceProps, getFloatingProps } = useInteractions([
        hoverable
          ? useHover(floating.context, {
              enabled: !disable && hoverable,
              handleClose: safePolygon({
                requireIntent: true,
                blockPointerEvents: true,
                buffer: 1,
              }),
              ...(hoverable && typeof hoverable === 'object' && hoverable),
            })
          : useHover(floating.context, {
              enabled: false,
            }),
        useFocus(floating.context, {
          enabled: !disable && !disableFocus,
          visibleOnly: true,
        }),
        useRole(floating.context, { role: 'dialog' }),
        useDismiss(floating.context, {
          enabled: !disable,
        }),
      ])
      return {
        ...floating,
        open,
        getReferenceProps,
        getFloatingProps,
      }
    },
    [open, setOpen, disable, disableFocus, hoverable]
  )
}
