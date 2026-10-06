import { Check } from '../../icons'
import { useId, useState } from 'react'
import { Text, View, debounce, Avatar } from 'tamagui'
import { useGroupMedia } from '../../hooks/useGroupMedia'
import { Checkboxes } from './common/checkboxParts'

const items = [
  {
    checked: false,
    title: 'Americano',
    desc: 'Espresso with hot water',
    key: 'americano',
    avatar: '/bento/images/coffee1.jpg',
  },
  {
    checked: false,
    title: 'Cappuccino',
    desc: 'Espresso with steamed milk foam',
    key: 'cappucino',
    avatar: '/bento/images/coffee2.jpg',
  },
  {
    checked: false,
    title: 'Espresso',
    desc: 'A concentrated form of coffee served in shots',
    key: 'espresso',
    avatar: '/bento/images/coffee3.jpg',
  },
  {
    checked: false,
    title: 'Flat White',
    desc: 'Espresso with steamed milk',
    key: 'flatWhite',
    avatar: '/bento/images/coffee4.jpg',
  },
  {
    title: 'Latte',
    checked: false,
    desc: 'Espresso with steamed milk',
    key: 'latte',
    avatar: '/bento/images/coffee5.jpg',
  },
]

/** ------ EXAMPLE ------ */
export function CheckboxList() {
  const [values, setValues] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((item) => [item.key, false]))
  )
  const uniqueId = useId()
  const { sm: wide, 'max-xs': tiny } = useGroupMedia('window')

  const onValuesChange = debounce((values: any) => {
    setValues(values)
  })

  return (
    <View width="100%" items="center">
      <Checkboxes
        values={values}
        onValuesChange={onValuesChange}
        borderStyle="solid"
        maxW="100%"
        overflow="hidden"
        width={wide ? 400 : undefined}
        boxShadow={wide ? '0 1px 9px shadow-color' : undefined}
        borderWidth={wide ? 1 : undefined}
        rounded={wide ? 20 : undefined}
        bg={wide ? 'color-2' : undefined}
        borderColor={wide ? 'border-color' : undefined}
        p={wide ? '4' : undefined}
      >
        <Checkboxes.FocusGroup gap="4">
          <View flexDirection="column" self="center" items="center" gap="2">
            <Checkboxes.Title self="center">Coffee</Checkboxes.Title>
            <Text fontWeight="400" theme="level2">
              Make your choice.
            </Text>
          </View>

          <View flexDirection="column">
            {items?.map((value, i) => (
              <Checkboxes.FocusGroup.Item key={i} value={value.key}>
                <CheckboxItem
                  item={value}
                  key={value.key}
                  uniqueId={uniqueId}
                  xxs={tiny}
                />
              </Checkboxes.FocusGroup.Item>
            ))}
          </View>
        </Checkboxes.FocusGroup>
      </Checkboxes>
    </View>
  )
}

function CheckboxItem({
  item,
  uniqueId,
  xxs,
}: {
  item: (typeof items)[number]
  uniqueId: string
  xxs: boolean
}) {
  const { desc, title, key } = item

  return (
    <Checkboxes.Card
      flexDirection="row"
      bg="transparent"
      px="4 @max-xs/window:3"
      rounded={0}
      cursor="pointer"
      gap="4 @max-xs/window:3"
      py="3"
      borderWidth={0}
      items="center"
      borderLeftWidth="@max-xs/window:0px"
      borderRightWidth="@max-xs/window:0px"
    >
      <Avatar circular size={xxs ? '3' : '4'}>
        <Avatar.Image src={item.avatar} />
        <Avatar.Fallback borderColor="background" />
      </Avatar>
      <View flexDirection="column" flex={1}>
        <View flexDirection="row" items="center" gap="4">
          <View flexDirection="column" flex={1}>
            <Checkboxes.Checkbox.Label size="4" lineHeight="2" htmlFor={key + uniqueId}>
              {title}
            </Checkboxes.Checkbox.Label>
            <Text fontWeight="400" fontSize={10} theme="level3">
              {desc}
            </Text>
          </View>

          <Checkboxes.Checkbox ml="auto" id={key + uniqueId}>
            <Checkboxes.Checkbox.Indicator>
              <Check />
            </Checkboxes.Checkbox.Indicator>
          </Checkboxes.Checkbox>
        </View>
      </View>
    </Checkboxes.Card>
  )
}
