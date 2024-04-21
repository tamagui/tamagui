import { useControllableState } from '@tamagui/use-controllable-state'

import type { SheetProps } from './types'
import { useSheetController } from './useSheetController'
import { useEffect, useState } from 'react'

export const useSheetOpenState = (props: SheetProps) => {
  const { isHidden, controller } = useSheetController()

  const onOpenChangeInternal = (val: boolean) => {
    controller?.onOpenChange?.(val)
    props.onOpenChange?.(val)
  }

  const [initialOpen, setInitialOpen] = useState(controller?.open ?? props.open)

  const [open, setOpen] = useControllableState({
    prop: controller?.open ?? props.open,
    defaultProp: props.defaultOpen ?? false,
    onChange: onOpenChangeInternal,
    strategy: 'most-recent-wins',
    transition: true,
  })

  useEffect(() => {
    setInitialOpen(open)
  }, [open])

  return {
    open,
    setOpen,
    isHidden,
    controller,
    initialOpen,
    setInitialOpen,
  }
}

export type SheetOpenState = ReturnType<typeof useSheetOpenState>
