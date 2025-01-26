import { useId, useState } from 'react'
import { H2, Label, RadioGroup, SizableText, Text, View } from 'tamagui'
import { Card } from './components/radioParts'

const data = [
  {
    id: 'vd-with-desc-paypal',
    label: 'PayPal',
    description: 'You will be redirected to the PayPal website',
  },
  {
    id: 'vd-with-desc-mastercard',
    label: 'Mastercard',
    description: 'Mastercard secure code is a private code for you',
  },
  {
    id: 'vd-with-desc-visa',
    label: 'Visa',
    description: 'This is a secure 128-bit SSL encrypted payment',
  },
]
/** ------ EXAMPLE ------ */
export function VerticalWithDescription() {
  const [value, setValue] = useState('vd-visa')
  const uniqueId = useId()
  return (
    <View width="100%" ai="center">
      <View
        flexDirection="column"
        minWidth="100%"
        $group-window-gtSm={{ maxWidth: 400, minWidth: 400 }}
        gap="$4"
      >
        <View flexDirection="column" gap="$2">
          <H2>Payment</H2>
          <Text fontWeight="300" color="$gray10">
            Select your payment method
          </Text>
        </View>
        <RadioGroup flexShrink={1} value={value} onValueChange={setValue}>
          <View flexDirection="column" flexShrink={1} flexWrap="wrap" gap="$2">
            {data.map(({ id, label, description }) => (
              <Item
                key={id}
                selected={value === id}
                uniqueId={uniqueId}
                setValue={setValue}
                description={description}
                id={id}
                label={label}
              />
            ))}
          </View>
        </RadioGroup>
      </View>
    </View>
  )
}

type ItemProps = {
  id: string
  label: string
  description: string
  setValue: (value: string) => void
  uniqueId: string
  selected: boolean
}
const Item = ({ id, label, description, setValue, uniqueId, selected }: ItemProps) => {
  return (
    <Card
      flexDirection="row"
      flexShrink={1}
      alignItems="flex-start"
      gap="$3"
      padding="$3"
      active={selected}
      onPress={() => setValue(id)}
      cursor="pointer"
    >
      <View onPress={(e) => e.stopPropagation()}>
        <RadioGroup.Item id={uniqueId + id} value={id}>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
      </View>
      <View flexDirection="column" flexShrink={1}>
        <Label
          size="$4"
          lineHeight="$2"
          alignItems="flex-start"
          flexDirection="column"
          htmlFor={uniqueId + id}
          cursor="pointer"
        >
          {label}
        </Label>
        <SizableText flexShrink={1} size="$3" fontWeight="300" color="$gray9">
          {description}
        </SizableText>
      </View>
    </Card>
  )
}

VerticalWithDescription.fileName = 'VerticalWithDescription'
