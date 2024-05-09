import { Stack, Text } from 'tamagui'
import {
  useAccordion,
  useAccordionItem,
  ACCORDION_CONTEXT,
  Collection,
  AccordionItemContextProvider,
} from '@tamagui/accordion-headless'

const values = ['a1', 'a2', 'a3']

export function AccordionHeadlessDemo() {
  return (
    <Collection.Provider __scopeCollection={ACCORDION_CONTEXT}>
      <AccordionHeadless />
    </Collection.Provider>
  )
}

function AccordionHeadless() {
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
    <ValueProvider value={valueProviderValue}>
      <CollapsibleProvider value={collapsibleProviderValue}>
        <AccordionImplProvider value={accordionImplProviderValue}>
          <Collection.Slot {...collectionSlotProps}>
            <Stack overflow="hidden" width="$20" {...(frameProps as any)}>
              {values.map((value) => (
                <AccordionItemContextProvider value={value} key={value}>
                  <AccordionItem value={value} />
                </AccordionItemContextProvider>
              ))}
            </Stack>
          </Collection.Slot>
        </AccordionImplProvider>
      </CollapsibleProvider>
    </ValueProvider>
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
          <Stack bg="red" {...frame}>
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
