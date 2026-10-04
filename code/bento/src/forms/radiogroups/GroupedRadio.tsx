import { useState } from 'react'
import { Label, Text, View, useEvent, Avatar, YGroup } from 'tamagui'
import { Card, RadioGroup } from './components/radioParts'
import { useGroupMedia } from '../../hooks/useGroupMedia'

const items = [
  {
    title: 'PayPal',
    description: 'You will be redirected to the PayPal website',
    id: 'gr-paypal',
    image: `https://i.pravatar.cc/150?img=20`,
  },
  {
    title: 'Mastercard',
    description: 'Mastercard secure code is a private code for you',
    id: 'gr-mastercard',
    image: `https://i.pravatar.cc/150?img=20`,
  },
  {
    title: 'Visa',
    description: 'This is a secure 128-bit SSL encrypted payment',
    id: 'gr-visa',
    image: `https://i.pravatar.cc/150?img=20`,
  },
]

type Item = (typeof items)[number]

/** ------ EXAMPLE ------ */
export function GroupedRadio() {
  const [value, setValue] = useState('gr-paypal')
  return (
    <View
      flexDirection="column"
      items="center"
      justify="center"
      minW={'100%'}
      px="@max-md/window:4"
      py="@max-md/window:6"
    >
      <RadioGroup value={value} onValueChange={setValue} minWidth="100%">
        <YGroup rounded="6" data-hover>
          {items.map((item) => (
            <Item
              item={item}
              key={item.id}
              selected={value === item.id}
              setValue={setValue}
            />
          ))}
        </YGroup>
      </RadioGroup>
    </View>
  )
}

GroupedRadio.fileName = 'GroupedRadio'

function Item({
  selected,
  setValue,
  item,
}: {
  selected: boolean
  setValue: (value: string) => void
  item: Item
}) {
  const { 'max-sm': narrow } = useGroupMedia('window')
  const { description, id, image, title } = item
  const onPress = useEvent(() => setValue(id))
  return (
    <YGroup.Item>
      <Card
        flexDirection="row"
        p="4"
        gap="4"
        borderBottomWidth={1}
        mb={-1}
        height="@max-md/window:110px"
        items="@max-md/window:flex-start"
        active={selected}
        onPress={onPress}
      >
        <Avatar circular size={narrow ? '4' : '5'}>
          <Avatar.Image aria-label={`${title} logo`} src={image} />
          <Avatar.Fallback bg="background" />
        </Avatar>
        <View flex={1} gap="2">
          <View flexDirection="row" gap="2">
            <View flexDirection="row" items="center" flex={1} gap="2">
              <Label size="6" fontWeight="500" lineHeight="2" htmlFor={id}>
                {title}
              </Label>
              <View
                theme="blue"
                rounded={100_000}
                bg="color-6"
                items="center"
                px="2"
                py="1"
              >
                <Text color="color-9" fontSize="3" fontWeight="1">
                  Verified
                </Text>
              </View>
            </View>
            <View onPress={(e) => e.stopPropagation()}>
              <RadioGroup.Item marginLeft="auto" id={id} value={id}>
                <RadioGroup.Indicator
                  width="33%"
                  height="33%"
                  rounded={1000}
                  bg="color"
                />
              </RadioGroup.Item>
            </View>
          </View>
          <View maxW="80%">
            <Text
              wordWrap="break-word"
              fontSize="3"
              lineHeight="3"
              fontWeight="300"
              color="color-8"
            >
              {description}
            </Text>
          </View>
        </View>
      </Card>
    </YGroup.Item>
  )
}
