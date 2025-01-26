import { useState } from 'react'
import { H2, Text, Label, RadioGroup, View } from 'tamagui'
import { Card } from './components/radioParts'

const data = [
  {
    id: 'hor-with-desc-paypal',
    label: 'PayPal',
    icon: 'paypal',
    description: 'You will be redirected to the PayPal website',
  },
  {
    id: 'hor-with-desc-mastercard',
    label: 'Mastercard',
    icon: 'mastercard',
    description: 'Mastercard secure code is a private code for you',
  },
  {
    id: 'hor-with-desc-visa',
    label: 'Visa',
    icon: 'visa',
    description: 'This is a secure 128-bit SSL encrypted payment',
  },
  {
    id: 'hor-with-desc-am',
    label: 'American Express',
    icon: 'amex',
    description: `This is a secure 128-bit SSL encrypted payment`,
  },
]
/** ------ EXAMPLE ------ */
export function HorizontalWithDescription() {
  const [value, setValue] = useState('vd-visa')
  return (
    <View flexDirection="column" maxWidth="100%" gap="$4">
      <View flexDirection="column" gap="$2">
        <H2>Payment</H2>
        <Text fontWeight="300" color="$gray10">
          Select your payment method
        </Text>
      </View>
      <RadioGroup
        value={value}
        onValueChange={setValue}
        flexDirection="row"
        flexShrink={1}
        flexWrap="wrap"
        gap="$4"
        rowGap="$4"
      >
        {data.map(({ id, label, icon, description }) => (
          <Item
            key={id}
            selected={value === id}
            setValue={setValue}
            description={description}
            id={id}
            label={label}
            icon={icon}
          />
        ))}
        {/* a trick to avoid last flex item to be stretch out */}
        <View flexDirection="row" key="last" flex={1} flexShrink={1} flexBasis={300} />
      </RadioGroup>
    </View>
  )
}

type ItemProps = {
  id: string
  label: string
  icon: string
  description: string
  setValue: (val: string) => void
  selected: boolean
}

const Item = ({ id, label, description, icon, setValue, selected }: ItemProps) => {
  return (
    <Card
      borderRadius="$5"
      flexDirection="row"
      flex={1}
      flexBasis={500}
      flexShrink={1}
      gap="$3"
      padding="$3"
      active={selected}
      onPress={() => setValue(id)}
    >
      <View onPress={(e) => e.stopPropagation()}>
        <RadioGroup.Item m="$1" id={id} value={id}>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
      </View>

      <View flexDirection="column" gap="$1" flex={1}>
        <Label
          size="$4"
          lineHeight="$2"
          cursor="pointer"
          alignItems="flex-start"
          flexDirection="column"
          htmlFor={id}
        >
          {label}
        </Label>

        <Text color="$gray9">{description}</Text>
      </View>
    </Card>
  )
}

HorizontalWithDescription.fileName = 'HorizontalWithDescription'
