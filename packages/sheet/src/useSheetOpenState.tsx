import { useControllableState } from '@tamagui/use-controllable-state'

import { SheetProps } from './types'
import { useSheetContoller } from './useSheetContoller'

export const useSheetOpenState = (props: SheetProps) => {
  const { isHidden, controller } = useSheetContoller()

  const onOpenChangeInternal = (val: boolean) => {
    controller?.onOpenChange?.(val)
    props.onOpenChange?.(val)
  }

  const [open, setOpen] = useControllableState({
    prop: controller?.open ?? props.open,
    defaultProp: props.defaultOpen ?? false,
    onChange: onOpenChangeInternal,
    strategy: 'most-recent-wins',
    transition: true,
  })

  return {
    open,
    setOpen,
    isHidden,
    controller,
  }
}

export type SheetOpenState = ReturnType<typeof useSheetOpenState>
