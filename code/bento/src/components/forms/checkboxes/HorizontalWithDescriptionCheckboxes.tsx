import { Check } from '@tamagui/lucide-icons'
import { useId, useState } from 'react'
import { Text, View, debounce } from 'tamagui'
import { Checkboxes } from './common/checkboxParts'

const items = [
  {
    id: 'hor-with-desc-paypal',
    label: 'PayPal',
    description: 'You will be redirected to the PayPal website',
    checked: false,
  },
  {
    id: 'hor-with-desc-mastercard',
    label: 'Mastercard',
    description: 'Mastercard secure code is a private code for you',
    checked: false,
  },

  {
    id: 'hor-with-desc-visa',
    label: 'Visa',
    description: 'This is a secure 128-bit SSL encrypted payment',
    checked: false,
  },
]

/** ------ EXAMPLE ------ */
export function HorizontalWithDescriptionCheckboxes() {
  const uniqueId = useId()

  const [values, setValues] = useState(() =>
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
        maxWidth="100%"
        minWidth="100%"
        gap="$4"
        $group-window-gtXs={{
          paddingHorizontal: '$8',
        }}
      >
        <Checkboxes.Title>Payment</Checkboxes.Title>
        <Text fontSize="$5" lineHeight="$5" fontWeight="300" col="$gray10">
          Select your payment method
        </Text>
        <Checkboxes.FocusGroup
          flexDirection="row"
          width="100%"
          flexWrap="wrap"
          gap="$3"
          rowGap="$2.5"
        >
          {items.map(({ id, label, description }) => (
            <Checkboxes.FocusGroup.Item
              flex={1}
              flexBasis={300}
              flexShrink={1}
              value={id}
              key={id}
            >
              <Item
                key={id}
                description={description}
                id={id}
                label={label}
                uniqueId={uniqueId}
              />
            </Checkboxes.FocusGroup.Item>
          ))}
          {/* a trick to avoid last flex item to be stretch out */}
          <View flexDirection="row" key="last" flex={1} flexShrink={1} flexBasis={300} />
        </Checkboxes.FocusGroup>
      </Checkboxes>
    </View>
  )
}

HorizontalWithDescriptionCheckboxes.fileName = 'HorizontalWithDescriptionCheckboxes'

function Item({
  id,
  label,
  description,
  uniqueId,
}: {
  id: string
  label: string
  description: string
  uniqueId: string
}) {
  return (
    <Checkboxes.Card
      flexDirection="row"
      alignItems="flex-start"
      gap="$3"
      $group-window-gtXs={{
        height: '100%',
      }}
      padding="$3"
      paddingHorizontal="$3.5"
      cursor="pointer"
    >
      <View flexDirection="row" y={1}>
        <Checkboxes.Checkbox id={id + uniqueId}>
          <Checkboxes.Checkbox.Indicator>
            <Check />
          </Checkboxes.Checkbox.Indicator>
        </Checkboxes.Checkbox>
      </View>

      <View flexDirection="column" gap="$1" flexShrink={1}>
        <Checkboxes.Checkbox.Label
          size="$4"
          lineHeight="$2"
          alignItems="flex-start"
          flexDirection="column"
          cursor="pointer"
          htmlFor={id + uniqueId}
        >
          {label}
        </Checkboxes.Checkbox.Label>
        <Text flexShrink={1} fontWeight="300" fontSize={'$3'} color="$gray9">
          {description}
        </Text>
      </View>
    </Checkboxes.Card>
  )
}
