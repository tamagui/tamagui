import { Check } from '../../icons'
import { useId, useState } from 'react'
import { Text, View, YStack, debounce } from 'tamagui'
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
    <View width="100%" items="center">
      <Checkboxes
        values={values}
        onValuesChange={onValuesChange}
        maxW="100%"
        px="@max-md/window:4"
        py="@max-md/window:6"
        width="@sm/window:400px"
        gap="4"
      >
        <YStack gap="1">
          <Checkboxes.Title>Payment</Checkboxes.Title>
          <Text fontSize="5" fontWeight="300" color="color-8">
            Select your payment method
          </Text>
        </YStack>
        <Checkboxes.FocusGroup minW="100%" flexWrap="wrap" gap="2">
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
    <View width="100%" items="center">
      <Checkboxes.Card
        flexDirection="row"
        shrink={1}
        items="flex-start"
        gap="3"
        p="3"
        borderColor="hover:color-6"
        cursor="pointer"
        maxW="100%"
        minW="100%"
      >
        <View flexDirection="row" y={1}>
          <Checkboxes.Checkbox id={uniqueId}>
            <Checkboxes.Checkbox.Indicator>
              <Check />
            </Checkboxes.Checkbox.Indicator>
          </Checkboxes.Checkbox>
        </View>

        <View flexDirection="column" shrink={1}>
          <Checkboxes.Checkbox.Label
            cursor="pointer"
            items="flex-start"
            lineHeight="2"
            flexDirection="column"
            size="4"
            htmlFor={uniqueId}
          >
            {label}
          </Checkboxes.Checkbox.Label>
          <Text shrink={1} fontSize="3" lineHeight="3" fontWeight="300" color="color-8">
            {description}
          </Text>
        </View>
      </Checkboxes.Card>
    </View>
  )
}
