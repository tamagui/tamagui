import { Check } from '@tamagui/lucide-icons'
import { useId, useState } from 'react'
import { Text, View, debounce } from 'tamagui'
import { Checkboxes } from './common/checkboxParts'

const items = [
  {
    id: 'ver-with-desc-paypal',
    label: 'PayPal',
    description: 'You will be redirected to the PayPal website',
    defaultChecked: false,
  },
  {
    id: 'ver-with-desc-mastercard',
    label: 'Mastercard',
    description: 'Mastercard secure code is a private code for you',
    defaultChecked: false,
  },

  {
    id: 'ver-with-desc-visa',
    label: 'Visa',
    description: 'This is a secure 128-bit SSL encrypted payment',
    defaultChecked: false,
  },
]

/** ------ EXAMPLE ------ */
export function VerticalWithDescriptionCheckboxes() {
  const uniqueId = useId()

  const [values, setValues] = useState(() =>
    items.reduce((a, b) => ({ ...a, [b.id]: b.defaultChecked }), {})
  )

  const onValuesChange = debounce((values: any) => {
    setValues(values)
  })

  return (
    <View width="100%" ai="center">
      <Checkboxes
        values={values}
        onValuesChange={onValuesChange}
        maxWidth="100%"
        $group-window-sm={{
          paddingHorizontal: '$4',
          paddingVertical: '$6',
        }}
        $group-window-gtXs={{ width: 400 }}
        gap="$4"
      >
        <Checkboxes.Title>Payment</Checkboxes.Title>
        <Text fontSize="$5" lineHeight="$5" fontWeight="300" col="$gray10">
          Select your payment method
        </Text>
        <Checkboxes.FocusGroup minWidth="100%" flexWrap="wrap" gap="$2">
          {items.map(({ id, label, description }) => (
            <Checkboxes.FocusGroup.Item value={id} key={id}>
              <Item description={description} label={label} uniqueId={id + uniqueId} />
            </Checkboxes.FocusGroup.Item>
          ))}
        </Checkboxes.FocusGroup>
      </Checkboxes>
    </View>
  )
}

VerticalWithDescriptionCheckboxes.fileName = 'VerticalWithDescriptionCheckboxes'

function Item({
  label,
  description,
  uniqueId,
}: {
  label: string
  description: string
  uniqueId: string
}) {
  return (
    <View width="100%" ai="center">
      <Checkboxes.Card
        flexDirection="row"
        flexShrink={1}
        alignItems="flex-start"
        gap="$3"
        padding="$3"
        hoverStyle={{
          borderColor: '$color7',
        }}
        cursor="pointer"
        maxWidth="100%"
        minWidth="100%"
      >
        <View flexDirection="row" y={1}>
          <Checkboxes.Checkbox id={uniqueId}>
            <Checkboxes.Checkbox.Indicator>
              <Check />
            </Checkboxes.Checkbox.Indicator>
          </Checkboxes.Checkbox>
        </View>

        <View flexDirection="column" flexShrink={1}>
          <Checkboxes.Checkbox.Label
            cursor="pointer"
            alignItems="flex-start"
            size="$4"
            lineHeight="$2"
            flexDirection="column"
            htmlFor={uniqueId}
          >
            {label}
          </Checkboxes.Checkbox.Label>
          <Text
            flexShrink={1}
            fontSize="$3"
            lineHeight="$3"
            fontWeight="300"
            color="$gray9"
          >
            {description}
          </Text>
        </View>
      </Checkboxes.Card>
    </View>
  )
}
