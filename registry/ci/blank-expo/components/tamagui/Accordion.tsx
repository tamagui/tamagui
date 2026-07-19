// Styled Accordion = the unstyled @tamagui/ui Accordion behavior + the default
// v2-look skin on its Trigger and Content (theme background, padding, cursor,
// and hover/focus/press color styling). The behavior frames keep only the
// Collapsible trigger/content behavior. Single skin definition; the shadcn
// registry item is generated from this file.
import { Accordion as UiAccordion, styled, withStaticProperties } from '@tamagui/ui'

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

export const Accordion = withStaticProperties(UiAccordion, {
  Trigger: AccordionTrigger,
  Content: AccordionContent,
})
