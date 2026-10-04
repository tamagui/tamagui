import { Check } from '../../icons'
import { useState } from 'react'
import { Text, View, YStack, debounce } from 'tamagui'
import { Checkboxes } from './common/checkboxParts'

const items = [
  {
    id: 'hor-check-check-paypal',
    label: 'PayPal',
    checked: false,
  },
  {
    id: 'hor-check-mastercard',
    label: 'Mastercard',
    checked: false,
  },

  {
    id: 'hor-check-visa',
    label: 'Visa',
    checked: false,
  },
]

/** ------ EXAMPLE ------ */
export function HorizontalCheckboxes() {
  const [values, setValues] = useState<Record<string, boolean>>(() =>
    items.reduce((a, b) => ({ ...a, [b.id]: b.checked }), {})
  )

  const onValuesChange = debounce((values: any) => {
    setValues(values)
  })

  return (
    <View width="100%" items="center">
      <Checkboxes
        values={values}
        onValuesChange={onValuesChange}
        width={600}
        maxW="100%"
        gap="4"
        px="@max-md/window:4"
        py="@max-md/window:6"
      >
        <YStack gap="1">
          <Checkboxes.Title>Payment</Checkboxes.Title>
          <Text fontSize="5" fontWeight="300" color="color-8">
            Select your payment method
          </Text>
        </YStack>

        <Checkboxes.FocusGroup
          flexDirection="row"
          columnGap="4"
          rowGap="2"
          flexWrap="wrap"
        >
          {items.map(({ id, label, checked }) => (
            <Checkboxes.FocusGroup.Item
              flex={1}
              flexBasis="100% @sm/window:150px"
              value={id}
              key={id}
            >
              <Item id={id} label={label} checked={values[id]} />
            </Checkboxes.FocusGroup.Item>
          ))}
        </Checkboxes.FocusGroup>
      </Checkboxes>
    </View>
  )
}

HorizontalCheckboxes.fileName = 'HorizontalCheckboxes'

function Item({ id, label, checked }: { id: string; label: string; checked: boolean }) {
  return (
    <View width="100%" items="center">
      <Checkboxes.Card
        flexDirection="row"
        borderColor="hover:color-6"
        items="center"
        gap="3"
        p={0}
        px="3"
        cursor="pointer"
      >
        <Checkboxes.Checkbox id={id}>
          <Checkboxes.Checkbox.Indicator>
            <Check />
          </Checkboxes.Checkbox.Indicator>
        </Checkboxes.Checkbox>

        <Checkboxes.Checkbox.Label cursor="pointer" htmlFor={id}>
          {label}
        </Checkboxes.Checkbox.Label>
      </Checkboxes.Card>
    </View>
  )
}
