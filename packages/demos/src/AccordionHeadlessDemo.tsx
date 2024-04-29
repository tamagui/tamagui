import { Stack, Text } from 'tamagui'
import { useAccordion, useAccordionItem } from '@tamagui/accordion-headless'

const values = ['a1', 'a2', 'a3']

export function AccordionHeadlessDemo() {
  const {
    CollapsibleProvider,
    collapsibleProviderValue,
    ValueProvider,
    valueProviderValue,
    Collection,
    collectionProviderProps,
    AccordionImplProvider,
    accordionImplProviderValue,
    frameProps,
    collectionSlotProps,
  } = useAccordion('single', {
    defaultValue: 'a1',
  })

  return (
    <Collection.Provider {...collectionProviderProps}>
      <ValueProvider value={valueProviderValue}>
        <CollapsibleProvider value={collapsibleProviderValue}>
          <AccordionImplProvider value={accordionImplProviderValue}>
            <Collection.Slot {...collectionSlotProps}>
              <Stack overflow="hidden" width="$20" {...(frameProps as any)}>
                {values.map((value) => (
                  <AccordionItem key={value} value={value} />
                ))}
              </Stack>
            </Collection.Slot>
          </AccordionImplProvider>
        </CollapsibleProvider>
      </ValueProvider>
    </Collection.Provider>
  )
}

const AccordionItem = ({ value }) => {
  const {
    Collapsible,
    collapsibleProps,
    ItemProvider,
    itemProviderValue,
    trigger: { ItemSlot, frame },
    content,
  } = useAccordionItem(value)

  return (
    <ItemProvider value={itemProviderValue}>
      <Collapsible {...collapsibleProps}>
        <ItemSlot>
          <Stack {...frame}>
            <Text>value</Text>
          </Stack>
        </ItemSlot>
        <Collapsible.Content {...frame}>
          <Stack {...(content as any)}>
            <Text>This is some content in here</Text>
          </Stack>
        </Collapsible.Content>
      </Collapsible>
    </ItemProvider>
  )
}
