import { Check } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Avatar, Text, View, YGroup, debounce } from 'tamagui'
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
    <View width="100%" ai="center">
      <Checkboxes values={values} onValuesChange={onValuesChange}>
        <Checkboxes.FocusGroup
          minWidth="100%"
          loop
          $group-window-gtXs={{
            alignSelf: 'center',
            minWidth: 'unset',
            maxWidth: 400,
          }}
        >
          <Checkboxes.Group orientation="vertical" flexShrink={1} minWidth="100%">
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

function Item({
  item,
  checked,
}: {
  item: Item
  checked: boolean
}) {
  const { id, image } = item

  return (
    <YGroup.Item>
      <Checkboxes.Card
        flexDirection="row"
        backgroundColor={checked ? '$backgroundPress' : '$background'}
        borderColor={checked ? '$borderColorPress' : '$borderColor'}
        borderWidth={1}
        alignItems="center"
        gap="$3"
        width="100%"
        padding="$3.5"
        minHeight={90}
        cursor="pointer"
        $group-window-sm={{
          gap: '$2',
        }}
      >
        <Avatar circular size="$6">
          <Avatar.Image src={image} />
          <Avatar.Fallback borderColor="$background" />
        </Avatar>
        <View flexDirection="column" flex={1} gap="$2">
          <View flexDirection="row" gap="$2">
            <Checkboxes.Checkbox.Label size="$5" lh="$2" htmlFor={id}>
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
            fontSize="$3"
            lineHeight="$3"
            fontWeight="300"
            col="$gray9"
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
