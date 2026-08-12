import {
  createRefComponent,
  defaultTokenSizePolicy,
  Popover as UiPopover,
  styled,
  withStaticProperties,
} from '@tamagui/ui'
import * as React from 'react'

export const PopoverContent = styled(UiPopover.Content, {
  displayName: 'PopoverContent',
  padding: defaultTokenSizePolicy.space,
  borderRadius: defaultTokenSizePolicy.radius,
  backgroundColor: 'background',
  alignItems: 'center',
})

export const PopoverArrow = styled(UiPopover.Arrow, {
  displayName: 'PopoverArrow',
  backgroundColor: 'background',
  borderColor: 'border-color',
})

const PopoverRoot = createRefComponent<
  React.ComponentRef<typeof UiPopover>,
  React.ComponentProps<typeof UiPopover>
>(function Popover(props, ref) {
  return <UiPopover {...props} ref={ref} />
})

// keep the ref-handle type on the same name so `useRef<Popover>` still works
export type Popover = UiPopover

export const Popover = withStaticProperties(PopoverRoot, {
  Anchor: UiPopover.Anchor,
  Arrow: PopoverArrow,
  Trigger: UiPopover.Trigger,
  Content: PopoverContent,
  Close: UiPopover.Close,
  Adapt: UiPopover.Adapt,
  ScrollView: UiPopover.ScrollView,
  FocusScope: UiPopover.FocusScope,
})
