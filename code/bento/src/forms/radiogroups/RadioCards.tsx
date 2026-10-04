import { Clock, Dot } from '../../icons'
import { useState } from 'react'
import type { ThemeName } from 'tamagui'
import { Card, RadioGroup } from './components/radioParts'
import { H2, Text, View } from 'tamagui'

const packages = [
  {
    title: 'Toys',
    description: 'A package of toys',
    itemsCounts: 621,
    color: 'green',
  },
  {
    title: 'Books',
    description: 'A package of books',
    itemsCounts: 621,
    color: 'teal',
  },
  {
    title: 'Clothes',
    description: 'A package of clothes',
    itemsCounts: 621,
    color: 'yellow',
  },
  {
    title: 'Electronics',
    description: 'A package of electronics',
    itemsCounts: 621,
    color: 'blue',
  },
] as const

type Item = (typeof packages)[number]

/** ------ EXAMPLE ------ */
export function RadioCards() {
  const [value, setValue] = useState<string>()

  return (
    <View flexDirection="column" gap="4" width="100%" px="@sm/window:4" py="@sm/window:6">
      <H2>Select your gift</H2>
      <RadioGroup
        value={value}
        onValueChange={setValue}
        flexShrink={1}
        flexDirection="row"
        flexWrap="wrap"
        gap="3"
      >
        {packages.map((item) => (
          <Item
            item={item}
            key={item.title}
            selected={value === item.title}
            setValue={setValue}
          />
        ))}
      </RadioGroup>
    </View>
  )
}

RadioCards.fileName = 'RadioCards'

function Item({
  selected,
  setValue,
  item,
}: {
  selected: boolean
  setValue: (value: string) => void
  item: Item
}) {
  const { title, description, color } = item

  return (
    <Card
      onPress={(e) => {
        e.preventDefault()
        setValue(title)
      }}
      flex={1}
      flexBasis={400}
      shrink={1}
      gap="6"
      active={selected}
    >
      <View flex={1} flexBasis="auto" flexDirection="column" gap="3">
        <View flexDirection="row" justify="space-between">
          <View
            flexDirection="row"
            bg="color-6"
            rounded="4"
            items="center"
            justify="center"
            gap="2"
            py="2"
            px="3"
            theme={color as ThemeName}
          >
            <View width={10} height={10} bg="color-9" rounded={100} />
            <Text fontSize="3" color="color-10">
              {title}
            </Text>
          </View>

          <RadioGroup.Item id={title} value={title}>
            <RadioGroup.Indicator width="33%" height="33%" rounded={1000} bg="color" />
          </RadioGroup.Item>
        </View>
        <Text fontSize="3" theme="level2">
          {description}
        </Text>
      </View>

      <View flexDirection="row" gap="2" mt="auto" items="center">
        <Clock color="color-9" size={14} />
        <Text opacity={0.5} fontSize="3" fontWeight="300" theme="level3">
          last bought 2 hr ago
        </Text>
      </View>
    </Card>
  )
}
