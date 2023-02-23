import { Accordion, H1 } from 'tamagui'
export function AccordionDemo() {
  return (
    <Accordion orientation="horizontal" width={'$20'} type="multiple">
      <Accordion.Item value="a1">
        <Accordion.Trigger>Step 1. take a cold shower</Accordion.Trigger>
        <Accordion.Content>
          Cold showers can help reduce inflammation, relieve pain, improve circulation,
          lower stress levels, and reduce muscle soreness and fatigue.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="a2">
        <Accordion.Trigger>Step 2: eat 4 eggs</Accordion.Trigger>
        <Accordion.Content>
          Eggs have been a dietary staple since time immemorial and there’s good reason
          for their continued presence in our menus and meals.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  )
}
