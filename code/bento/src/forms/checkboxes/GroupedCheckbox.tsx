import { Check } from '../../icons'
import { useState } from 'react'
import { Text, View, debounce, Avatar, YGroup } from 'tamagui'
import { Checkboxes } from './common/checkboxParts'

/** ------ EXAMPLE ------ */
const items = [
  {
    title: 'PayPal',
    description: 'You will be redirected to the PayPal website',
    id: 'gr-paypal',
    checked: false,
    image: `https://i.pravatar.cc/150?img=20`,
  },
  {
    title: 'Mastercard',
    description: 'Mastercard secure code is a private code for you',
    id: 'gr-mastercard',
    checked: false,
    image: `https://i.pravatar.cc/150?img=20`,
  },
  {
    title: 'Visa',
    description: 'This is a secure 128-bit SSL encrypted payment',
    id: 'gr-visa',
    checked: false,
    image: `https://i.pravatar.cc/150?img=20`,
  },
]

type Item = (typeof items)[number]
export function GroupedCheckbox() {
  const [values, setValues] = useState<Record<string, boolean>>(() =>
    items.reduce(
      (a, b) => ({
        ...a,
        [b.id]: b.checked,
      }),
      {}
    )
  )

  const onValuesChange = debounce((values: any) => {
    setValues(values)
  })

  return (
    <View width="100%" items="center">
      <Checkboxes values={values} onValuesChange={onValuesChange}>
        <Checkboxes.FocusGroup
          minW="100% @sm/window:unset"
          self="@sm/window:center"
          maxW="@sm/window:400px"
          loop
        >
          <Checkboxes.Group orientation="vertical" shrink={1} minW="100%">
            {items.map((item) => (
              <Checkboxes.FocusGroup.Item value={item.id} key={item.id}>
                <Item checked={values[item.id]} key={item.id} item={item} />
              </Checkboxes.FocusGroup.Item>
            ))}
          </Checkboxes.Group>
        </Checkboxes.FocusGroup>
      </Checkboxes>
    </View>
  )
}

GroupedCheckbox.fileName = 'GroupedCheckbox'

function Item({ item, checked }: { item: Item; checked: boolean }) {
  const { id, image } = item

  return (
    <YGroup.Item>
      <Checkboxes.Card
        flexDirection="row"
        bg={`${checked ? 'background-press' : 'background'}`}
        borderColor={`${checked ? 'border-color-press' : 'border-color'}`}
        borderWidth={1}
        items="center"
        gap="3 @max-md/window:2"
        width="100%"
        p="4"
        minH={90}
        cursor="pointer"
      >
        <Avatar circular size="6">
          <Avatar.Image src={image} />
          <Avatar.Fallback borderColor="background" />
        </Avatar>
        <View flexDirection="column" flex={1} gap="2">
          <View flexDirection="row" gap="2">
            <Checkboxes.Checkbox.Label size="5" lineHeight="2" htmlFor={id}>
              Label
            </Checkboxes.Checkbox.Label>

            <Checkboxes.Checkbox marginLeft="auto" id={id} alignSelf="flex-start">
              <Checkboxes.Checkbox.Indicator>
                <Check />
              </Checkboxes.Checkbox.Indicator>
            </Checkboxes.Checkbox>
          </View>
          <Text
            numberOfLines={2}
            fontSize="3"
            lineHeight="3"
            fontWeight="300"
            color="color-8"
          >
            Laborum velit velit occaecat eiusmod laboris tempor. Lorem qui quis deserunt
            culpa. Ad eiusmod magna ad proident exercitation laborum qui quis
            reprehenderit occaecat.
          </Text>
        </View>
      </Checkboxes.Card>
    </YGroup.Item>
  )
}
