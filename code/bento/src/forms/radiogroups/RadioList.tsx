import { Avatar } from '../../BentoSkins'
import { useState } from 'react'
import { Card, RadioGroup } from './components/radioParts'
import { H3, Label, Separator, Text, View } from 'tamagui'
import { useGroupMedia } from '../../hooks/useGroupMedia'

const data = {
  rs_americano: {
    checked: false,
    title: 'Americano',
    desc: 'Espresso with hot water',
    key: 'rs_americano',
    avatar: 'https://tamagui.dev/bento/images/coffee1.jpg',
  },
  rs_cappucino: {
    checked: false,
    title: 'Cappuccino',
    desc: 'Espresso with steamed milk foam',
    key: 'rs_cappucino',
    avatar: 'https://tamagui.dev/bento/images/coffee2.jpg',
  },
  rs_espresso: {
    checked: false,
    title: 'Espresso',
    desc: 'A concentrated form of coffee served in shots',
    key: 'rs_espresso',
    avatar: 'https://tamagui.dev/bento/images/coffee3.jpg',
  },
  rs_flatWhite: {
    checked: false,
    title: 'Flat White',
    desc: 'Espresso with steamed milk',
    key: 'rs_flatWhite',
    avatar: 'https://tamagui.dev/bento/images/coffee4.jpg',
  },
  rs_latte: {
    title: 'Latte',
    checked: false,
    desc: 'Espresso with steamed milk',
    key: 'rs_latte',
    avatar: 'https://tamagui.dev/bento/images/coffee5.jpg',
  },
}

type Item = {
  checked: boolean
  desc: string
  title: string
  key: string
  avatar: string
}

/** ------ EXAMPLE ------ */
export function RadioList() {
  const { sm } = useGroupMedia('window')

  const [selected, setSelected] = useState<string>()

  const items = Object.values(data)

  return (
    <View self="center" items="center" width="100%">
      <RadioGroup>
        <View py="3" items="center">
          <H3>Drink</H3>
          <Text self="center" color="color-8">
            Select your favorite coffee
          </Text>
        </View>

        {sm && (
          <View width="100%" px="2">
            <Separator width="100%" borderColor="color-5" />
          </View>
        )}

        <View width="100%" gap="2" px="2">
          {items.map((item, i) => (
            <Item
              setSelected={(next) => setSelected(next)}
              selected={selected === item.key}
              key={item.key + i}
              item={item}
            />
          ))}
        </View>
      </RadioGroup>
    </View>
  )
}

function Item({
  item,
  setSelected,
  selected,
}: {
  item: Item
  selected: boolean
  setSelected: (value: string) => void
}) {
  const { desc, title, key } = item
  return (
    <Card
      rounded="4 @sm/window:0px"
      p="4"
      flexDirection="row"
      width="100%"
      gap="3"
      items="stretch"
      justify="space-between"
      borderTopWidth="1px @sm/window:0px"
      borderRightWidth="1px @sm/window:0px"
      borderLeftWidth="1px @sm/window:0px"
      borderBottomWidth="1px @sm/window:1px"
      borderColor="color-5"
      py="@sm/window:4"
      active={selected}
      onPress={() => {
        setSelected(key)
      }}
    >
      <Avatar circular size="4">
        <Avatar.Image aria-label={`${title} thumbnail`} src={item.avatar} />
        <Avatar.Fallback bg="background" />
      </Avatar>

      <View flex={10} self="stretch" gap="px">
        <Label
          // visual offset of font to top
          mt={-2}
          mr="auto"
          lineHeight="4"
          size="5"
          htmlFor={key}
        >
          {title}
        </Label>
        <Text fontSize="3" width="100%" color="color-9">
          {desc}
        </Text>
      </View>

      <View onPress={(e) => e.stopPropagation()}>
        <RadioGroup.Item id={key} value={key}>
          <RadioGroup.Indicator width="33%" height="33%" rounded={1000} bg="color" />
        </RadioGroup.Item>
      </View>
    </Card>
  )
}

RadioList.fileName = 'RadioList'
