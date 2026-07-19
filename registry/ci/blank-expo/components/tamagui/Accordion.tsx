// Styled Accordion = the unstyled @tamagui/ui Accordion behavior + the default
// v2-look skin on its Trigger and Content (theme background, padding, cursor,
// and hover/focus/press color styling). The behavior frames keep only the
// Collapsible trigger/content behavior. Single skin definition; the shadcn
// registry item is generated from this file.
import {
  Accordion as UiAccordion,
  createRefComponent,
  styled,
  type TamaguiElement,
  withStaticProperties,
} from '@tamagui/ui'
import type * as React from 'react'

export const AccordionTrigger = styled(UiAccordion.Trigger, {
  name: 'AccordionTrigger',
  cursor: 'pointer',
  backgroundColor: '$background',
  padding: true,
  hoverStyle: { backgroundColor: '$backgroundHover' },
  focusStyle: { backgroundColor: '$backgroundFocus' },
  pressStyle: { backgroundColor: '$backgroundPress' },
})

export const AccordionContent = styled(UiAccordion.Content, {
  name: 'AccordionContent',
  padding: true,
  backgroundColor: '$background',
})

// see Dialog.tsx: withStaticProperties assigns in place, so composing onto
// UiAccordion would rewrite @tamagui/ui's own Accordion.Trigger/.Content for every
// consumer of the unstyled package.
const AccordionRoot = createRefComponent<
  TamaguiElement,
  React.ComponentProps<typeof UiAccordion>
>(function Accordion(props, ref) {
  return <UiAccordion {...props} ref={ref} />
})

export const Accordion = withStaticProperties(AccordionRoot, {
  Header: UiAccordion.Header,
  Item: UiAccordion.Item,
  HeightAnimator: UiAccordion.HeightAnimator,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
})
