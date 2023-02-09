import { Adapt, useAdaptParent } from '@tamagui/adapt'
import { useId } from '@tamagui/core'
import { Popper } from '@tamagui/popper'
import { PortalHost } from '@tamagui/portal'
import { ControlledSheet } from '@tamagui/sheet'
import { useControllableState } from '@tamagui/use-controllable-state'
import { TamaguiElement, useEvent, withStaticProperties } from '@tamagui/web'
import * as React from 'react'

import {
  POPOVER_NAME,
  PopoverAnchor,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverProps,
  PopoverProviderInternal,
  PopoverScrollView,
  PopoverSheetController,
  PopoverTrigger,
  ScopedPopoverProps,
  usePopoverScope,
  useSheetBreakpointActive,
} from './Popover.components'

export const Popover = withStaticProperties(
  ((props: ScopedPopoverProps<PopoverProps>) => {
    const {
      __scopePopover,
      children,
      open: openProp,
      defaultOpen,
      onOpenChange,
      ...restProps
    } = props

    const internalId = useId()
    const id = __scopePopover ? Object.keys(__scopePopover)[0] : internalId

    const { when, AdaptProvider } = useAdaptParent({
      Contents: React.useCallback(() => {
        return <PortalHost name={`${id}SheetContents`} />
      }, []),
    })

    const sheetBreakpoint = when
    const popperScope = usePopoverScope(__scopePopover)
    const triggerRef = React.useRef<TamaguiElement>(null)
    const [hasCustomAnchor, setHasCustomAnchor] = React.useState(false)
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen || false,
      onChange: onOpenChange,
      transition: true,
    })

    const breakpointActive = useSheetBreakpointActive(sheetBreakpoint)

    const popoverContext = {
      scope: __scopePopover,
      scopeKey: id,
      popperScope: popperScope.__scopePopper,
      sheetBreakpoint,
      contentId: useId(),
      triggerRef,
      open,
      breakpointActive,
      onOpenChange: setOpen,
      onOpenToggle: useEvent(() => {
        if (open && breakpointActive) {
          return
        }
        setOpen(!open)
      }),
      hasCustomAnchor,
      onCustomAnchorAdd: React.useCallback(() => setHasCustomAnchor(true), []),
      onCustomAnchorRemove: React.useCallback(() => setHasCustomAnchor(false), []),
    }

    // debug if changing too often
    // if (process.env.NODE_ENV === 'development') {
    //   Object.keys(popoverContext).forEach((key) => {
    //     React.useEffect(() => console.log(`changed`, key), [popoverContext[key]])
    //   })
    // }

    const contents = (
      <Popper {...popperScope} stayInFrame {...restProps}>
        <PopoverProviderInternal {...popoverContext}>
          <PopoverSheetController onOpenChange={setOpen} __scopePopover={__scopePopover}>
            {children}
          </PopoverSheetController>
        </PopoverProviderInternal>
      </Popper>
    )

    return <AdaptProvider>{contents}</AdaptProvider>
  }) as React.FC<PopoverProps>,
  {
    Anchor: PopoverAnchor,
    Arrow: PopoverArrow,
    Trigger: PopoverTrigger,
    Content: PopoverContent,
    Close: PopoverClose,
    Adapt,
    ScrollView: PopoverScrollView,
    Sheet: ControlledSheet,
  }
)

Popover.displayName = POPOVER_NAME
