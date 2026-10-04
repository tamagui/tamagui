import { useId, useState } from 'react'
import { H2, Label, SizableText, Text, View } from 'tamagui'
import { Card, RadioGroup } from './components/radioParts'

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
    <View width="100%" items="center">
      <View
        flexDirection="column"
        minW="100% @md/window:400px"
        maxW="@md/window:400px"
        gap="4"
      >
        <View flexDirection="column" gap="2">
          <H2>Payment</H2>
          <Text fontWeight="300" color="color-8">
            Select your payment method
          </Text>
        </View>
        <RadioGroup shrink={1} value={value} onValueChange={setValue}>
          <View flexDirection="column" shrink={1} flexWrap="wrap" gap="2">
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
      shrink={1}
      items="flex-start"
      gap="3"
      p="3"
      cursor="pointer"
      active={selected}
      onPress={() => setValue(id)}
    >
      <View onPress={(e) => e.stopPropagation()}>
        <RadioGroup.Item id={uniqueId + id} value={id}>
          <RadioGroup.Indicator width="33%" height="33%" rounded={1000} bg="color" />
        </RadioGroup.Item>
      </View>
      <View flexDirection="column" shrink={1}>
        <Label
          size="4"
          lineHeight="2"
          items="flex-start"
          flexDirection="column"
          cursor="pointer"
          htmlFor={uniqueId + id}
        >
          {label}
        </Label>
        <SizableText shrink={1} fontWeight="300" color="color-8" size="3">
          {description}
        </SizableText>
      </View>
    </Card>
  )
}

VerticalWithDescription.fileName = 'VerticalWithDescription'
