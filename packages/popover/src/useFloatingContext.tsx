import type { UseFloatingOptions } from '@floating-ui/react'
import { useDismiss, useFloating, useInteractions, useRole } from '@floating-ui/react'
import { useCallback } from 'react'

// Custom floating context to override the Popper on web
export const useFloatingContext = ({ open, setOpen, breakpointActive }) =>
  useCallback(
    (props: UseFloatingOptions) => {
      const floating = useFloating({
        ...props,
        open,
        onOpenChange: setOpen,
      }) as any
      const { getReferenceProps, getFloatingProps } = useInteractions([
        // useFocus(floating.context, {
        //   enabled: !breakpointActive,
        //   keyboardOnly: true,
        // }),
        useRole(floating.context, { role: 'dialog' }),
        useDismiss(floating.context, {
          enabled: !breakpointActive,
        }),
      ])
      return {
        ...floating,
        open,
        getReferenceProps,
        getFloatingProps,
      }
    },
    [open, setOpen, breakpointActive]
  )
