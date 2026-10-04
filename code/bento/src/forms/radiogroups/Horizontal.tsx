import { useId, useState } from 'react'
import { H2, Label, Text, View } from 'tamagui'
import { Card, RadioGroup } from './components/radioParts'

const items = [
  { id: 'ver-1-paypal', label: 'PayPal', icon: 'paypal' },
  { id: 'ver-1-mastercard', label: 'Mastercard', icon: 'mastercard' },
  { id: 'ver-1-visa', label: 'Visa', icon: 'visa' },
]

/** ------ EXAMPLE ------ */
export function Horizontal() {
  const uniqueId = useId()
  const [value, setValue] = useState('hor-visa')
  return (
    <View width="100%" items="center">
      <View
        flexDirection="column"
        justify="center"
        width="100%"
        maxW={600}
        gap="4"
        px="@max-md/window:4"
        py="@max-md/window:6"
      >
        <View flexDirection="column" gap="2">
          <H2>Payment</H2>
          <Text fontWeight="300" color="color-8">
            Select your payment method
          </Text>
        </View>
        <RadioGroup
          flexWrap="wrap"
          columnGap="4"
          rowGap="2"
          flexDirection="row"
          value={value}
          onValueChange={setValue}
        >
          {items.map(({ id, label, icon }) => (
            <Card
              key={label}
              flexDirection="row"
              flex={1}
              flexBasis={150}
              items="center"
              gap="3"
              p={0}
              minW="100% @sm/window:auto"
              px="2-5"
              cursor="pointer"
              active={value === label}
              onPress={() => setValue(label)}
            >
              <View onPress={(e) => e.stopPropagation()}>
                <RadioGroup.Item id={uniqueId + label} value={label}>
                  <RadioGroup.Indicator
                    width="33%"
                    height="33%"
                    rounded={1000}
                    bg="color"
                  />
                </RadioGroup.Item>
              </View>

              <View flexDirection="row" items="center" gap="2">
                <Label cursor="pointer" htmlFor={uniqueId + label}>
                  {label}
                </Label>
              </View>
            </Card>
          ))}
        </RadioGroup>
      </View>
    </View>
  )
}

Horizontal.fileName = 'Horizontal'
