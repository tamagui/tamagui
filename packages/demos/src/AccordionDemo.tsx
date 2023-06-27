import { ChevronDown } from '@tamagui/lucide-icons'
import { Accordion, Paragraph, Square, useAccordion } from 'tamagui'

export function AccordionDemo() {
  // the useAccordion hook is optional for when you need more control
  // if you leave it out, Accordion will work in "uncontrolled" mode
  // where it handles all the state internally
  const { control, selected } = useAccordion()

  return (
    <Accordion control={control} overflow="hidden" width="$20" type="multiple">
      <Accordion.Item value="a1">
        <Accordion.Trigger
          focusStyle={{
            borderColor: '#fdfdfd',
          }}
          flexDirection="row"
          justifyContent="space-between"
        >
          {({ open }) => (
            <>
              <Paragraph size="$5">1. Take a cold shower</Paragraph>
              <Square animation={'quick'} rotate={open ? '180deg' : '0deg'}>
                <ChevronDown size="$1" />
              </Square>
            </>
          )}
        </Accordion.Trigger>
        <Accordion.Content>
          <Paragraph>
            Cold showers can help reduce inflammation, relieve pain, improve circulation,
            lower stress levels, and reduce muscle soreness and fatigue.
          </Paragraph>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="a2">
        <Accordion.Trigger
          focusStyle={{
            borderColor: '#fdfdfd',
          }}
          flexDirection="row"
          justifyContent="space-between"
        >
          <>
            <Paragraph size="$5">2. Eat 4 eggs</Paragraph>
            <Square
              animation={'quick'}
              rotate={selected.includes('a2') ? '180deg' : '0deg'}
            >
              <ChevronDown size="$1" />
            </Square>
          </>
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
