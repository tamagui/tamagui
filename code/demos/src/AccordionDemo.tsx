import { ChevronDown } from '@tamagui/lucide-icons'
import { Accordion, Paragraph, Square } from 'tamagui'

export function AccordionDemo() {
  return (
    <Accordion overflow="hidden" width="$20" type="multiple">
      {/* negative margin prevents double border between items */}
      <Accordion.Item value="a1" mb={-1}>
        <Accordion.Trigger
          flexDirection="row"
          justify="space-between"
          borderWidth={1}
          borderColor="$borderColor"
        >
          {({
            open,
          }: {
            open: boolean
          }) => (
            <>
              <Paragraph>1. Take a cold shower</Paragraph>
              <Square transparent transition="quick" rotate={open ? '180deg' : '0deg'}>
                <ChevronDown size="$1" color="$color" />
              </Square>
            </>
          )}
        </Accordion.Trigger>
        <Accordion.HeightAnimator transition="100ms">
          <Accordion.Content
            transition="100ms"
            exitStyle={{ opacity: 0 }}
            borderWidth={1}
            borderTopWidth={0}
            borderColor="$borderColor"
          >
            <Paragraph>
              Cold showers can help reduce inflammation, relieve pain, improve
              circulation, lower stress levels, and reduce muscle soreness and fatigue.
            </Paragraph>
          </Accordion.Content>
        </Accordion.HeightAnimator>
      </Accordion.Item>

      <Accordion.Item value="a2">
        <Accordion.Trigger
          flexDirection="row"
          justify="space-between"
          borderWidth={1}
          borderColor="$borderColor"
        >
          {({
            open,
          }: {
            open: boolean
          }) => (
            <>
              <Paragraph>2. Eat 4 eggs</Paragraph>
              <Square transparent transition="quick" rotate={open ? '180deg' : '0deg'}>
                <ChevronDown size="$1" color="$color" />
              </Square>
            </>
          )}
        </Accordion.Trigger>
        <Accordion.HeightAnimator transition="100ms">
          <Accordion.Content
            transition="100ms"
            exitStyle={{ opacity: 0 }}
            borderWidth={1}
            borderTopWidth={0}
            borderColor="$borderColor"
          >
            <Paragraph>
              Eggs have been a dietary staple since time immemorial and there's good
              reason for their continued presence in our menus and meals.
            </Paragraph>
          </Accordion.Content>
        </Accordion.HeightAnimator>
      </Accordion.Item>
    </Accordion>
  )
}
