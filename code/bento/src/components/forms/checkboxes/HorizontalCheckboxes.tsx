import { Check } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Text, View, debounce } from 'tamagui'
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
    <View width="100%" ai="center">
      <Checkboxes
        values={values}
        onValuesChange={onValuesChange}
        width={600}
        maxWidth="100%"
        gap="$4"
        $group-window-sm={{
          paddingHorizontal: '$4',
          paddingVertical: '$6',
        }}
      >
        <Checkboxes.Title>Payment</Checkboxes.Title>
        <Text fontSize="$5" lineHeight="$5" fontWeight="300" col="$gray10">
          Select your payment method
        </Text>
        <Checkboxes.FocusGroup flexDirection="row" gap="$4" flexWrap="wrap" rowGap="$2">
          {items.map(({ id, label, checked }) => (
            <Checkboxes.FocusGroup.Item
              flex={1}
              flexBasis="100%"
              $group-window-gtXs={{
                flexBasis: 150,
              }}
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

function Item({
  id,
  label,
  checked,
}: {
  id: string
  label: string
  checked: boolean
}) {
  return (
    <View width="100%" ai="center">
      <Checkboxes.Card
        flexDirection="row"
        hoverStyle={{
          borderColor: '$color7',
        }}
        alignItems="center"
        gap="$3"
        padding={0}
        paddingHorizontal="$3"
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
