import { Clock, Dot } from '@tamagui/lucide-icons'
import { useState } from 'react'
import type { ThemeName } from 'tamagui'
import { Card } from './components/radioParts'
import { H2, RadioGroup, Text, View } from 'tamagui'

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
    color: 'purple',
  },
  {
    title: 'Clothes',
    description: 'A package of clothes',
    itemsCounts: 621,
    color: 'orange',
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
    <View
      flexDirection="column"
      gap="$4"
      width="100%"
      $group-window-sm={{
        paddingHorizontal: '$4',
        paddingVertical: '$6',
      }}
    >
      <H2>Select your gift</H2>
      <RadioGroup
        value={value}
        onValueChange={setValue}
        flexShrink={1}
        flexDirection="row"
        flexWrap="wrap"
        gap="$3"
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
      flexShrink={1}
      gap="$6"
      active={selected}
    >
      <View f={1} flexDirection="column" gap="$3">
        <View flexDirection="row" justifyContent="space-between">
          <View
            flexDirection="row"
            theme={color}
            backgroundColor="$color6"
            borderRadius="$4"
            alignItems="center"
            justifyContent="center"
            gap="$2"
            py="$2"
            px="$3"
          >
            <View width={10} height={10} backgroundColor="$color10" borderRadius={100} />
            <Text fontSize="$3" color="$color11">
              {title}
            </Text>
          </View>

          <RadioGroup.Item id={title} value={title}>
            <RadioGroup.Indicator />
          </RadioGroup.Item>
        </View>
        <Text fontSize="$3" theme="alt1">
          {description}
        </Text>
      </View>

      <View flexDirection="row" gap="$2" marginTop="auto" alignItems="center">
        <Clock color="$color10" size={14} />
        <Text o={0.7} fontSize="$3" fontWeight="300" theme="alt2">
          last bought 2 hr ago
        </Text>
      </View>
    </Card>
  )
}
