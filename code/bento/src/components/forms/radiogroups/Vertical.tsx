import { useId, useState } from 'react'
import { Avatar, H2, Label, RadioGroup, Text, View } from 'tamagui'
import { Card } from './components/radioParts'

const data = [
  {
    id: 'ver-1-paypal',
    label: 'PayPal',
    icon: 'paypal',
  },
  {
    id: 'ver-1-mastercard',
    label: 'Mastercard',
    icon: 'mastercard',
  },
  {
    id: 'ver-1-visa',
    label: 'Visa',
    icon: 'visa',
  },
]
/** ------ EXAMPLE ------ */
export function Vertical() {
  const uniqueId = useId()
  const [value, setValue] = useState('hor-visa')
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
        <RadioGroup
          $group-window-gtSm={{ maxWidth: 400 }}
          flexWrap="wrap"
          gap="$2"
          flexDirection="column"
          value={value}
          onValueChange={setValue}
        >
          {data.map(({ id, label, icon }) => (
            <Card
              padding={0}
              key={id}
              flexDirection="row"
              alignItems="center"
              gap="$3"
              paddingHorizontal="$2.5"
              active={value === id}
              onPress={() => setValue(id)}
            >
              <View onPress={(e) => e.stopPropagation()}>
                <RadioGroup.Item id={uniqueId + id} value={id}>
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
              </View>
              <Label cursor="pointer" htmlFor={uniqueId + id}>
                {label}
              </Label>
            </Card>
          ))}
        </RadioGroup>
      </View>
    </View>
  )
}

Vertical.fileName = 'Vertical'
