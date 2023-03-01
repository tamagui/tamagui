import { Accordion, Paragraph } from 'tamagui'

export function AccordionDemo() {
  return (
    <Accordion orientation="horizontal" width="$20" type="multiple">
      <Accordion.Item value="a1">
        <Accordion.Trigger>
          <Paragraph>1. Take a cold shower</Paragraph>
        </Accordion.Trigger>
        <Accordion.Content>
          <Paragraph>
            Cold showers can help reduce inflammation, relieve pain, improve circulation,
            lower stress levels, and reduce muscle soreness and fatigue.
          </Paragraph>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="a2">
        <Accordion.Trigger>
          <Paragraph>2: Eat 4 eggs</Paragraph>
        </Accordion.Trigger>
        <Accordion.Content>
          <Paragraph>
            Eggs have been a dietary staple since time immemorial and there’s good reason
            for their continued presence in our menus and meals.
          </Paragraph>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  )
}
