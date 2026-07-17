import { ChevronDown } from '@tamagui/lucide-icons-2'
import { Accordion, Paragraph, Square, YStack } from 'tamagui'

// verifies first-paint of a defaultValue-open item shows content at full height
// (no collapse-to-0 flash), which is the client-side equivalent of the SSR case.
// used by both the web Accordion.test and the native Accordion.e2e (Detox), so
// elements carry both `id` (web css selectors) and `testID` (native Detox).
export function AccordionDefaultOpenCase() {
  return (
    <YStack testID="accordion-default-root" p="$4">
      <Accordion overflow="hidden" width="$20" type="multiple" defaultValue={['a1']}>
        <Accordion.Item value="a1" mb={-1}>
          <Accordion.Trigger
            id="def-trigger"
            testID="def-trigger"
            flexDirection="row"
            justify="space-between"
            borderWidth={1}
            borderColor="$borderColor"
          >
            {({ open }: { open: boolean }) => (
              <>
                <Paragraph>Open by default</Paragraph>
                <Square transparent transition="quick" rotate={open ? '180deg' : '0deg'}>
                  <ChevronDown size="$1" color="$color" />
                </Square>
              </>
            )}
          </Accordion.Trigger>
          <Accordion.HeightAnimator transition="300ms">
            <Accordion.Content
              id="def-content"
              testID="def-content"
              transition="300ms"
              exitStyle={{ opacity: 0 }}
              borderWidth={1}
              borderTopWidth={0}
              borderColor="$borderColor"
            >
              <Paragraph testID="def-content-text">
                This content should be visible immediately on first paint, at its full
                natural height, with no collapse-to-zero flash.
              </Paragraph>
            </Accordion.Content>
          </Accordion.HeightAnimator>
        </Accordion.Item>

        <Accordion.Item value="a2">
          <Accordion.Trigger
            id="def-trigger2"
            testID="def-trigger2"
            flexDirection="row"
            justify="space-between"
            borderWidth={1}
            borderColor="$borderColor"
          >
            {({ open }: { open: boolean }) => (
              <>
                <Paragraph>Closed by default</Paragraph>
                <Square transparent transition="quick" rotate={open ? '180deg' : '0deg'}>
                  <ChevronDown size="$1" color="$color" />
                </Square>
              </>
            )}
          </Accordion.Trigger>
          <Accordion.HeightAnimator transition="300ms">
            <Accordion.Content
              testID="def-content2"
              transition="300ms"
              exitStyle={{ opacity: 0 }}
              borderWidth={1}
              borderTopWidth={0}
              borderColor="$borderColor"
            >
              <Paragraph testID="def-content2-text">Second item content.</Paragraph>
            </Accordion.Content>
          </Accordion.HeightAnimator>
        </Accordion.Item>
      </Accordion>
    </YStack>
  )
}
