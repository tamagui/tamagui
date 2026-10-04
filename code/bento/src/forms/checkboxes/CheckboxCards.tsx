import { Check, Clock } from '../../icons'
import { Checkboxes } from './common/checkboxParts'
import { useState } from 'react'
import { Text, View, debounce } from 'tamagui'

const packages = [
  {
    title: 'Toys',
    description:
      'A whimsical package of toys, guaranteed to spark joy and creativity in hearts young and old.',
    itemsCounts: 621,
    color: 'red',
  },
  {
    title: 'Books',
    description:
      'A curated package of books, spanning tales of fantasy and slices of history.',
    itemsCounts: 621,
    color: 'green',
  },
  {
    title: 'Clothes',
    description: 'A stylish package of clothes tailored for every season.',
    itemsCounts: 621,
    color: 'blue',
  },
  {
    title: 'Games',
    description:
      'A thrilling package of games, filled with puzzles and challenges to entertain for hours.',
    itemsCounts: 18,
    color: 'yellow',
  },
] as const

/** ------ EXAMPLE ------ */
export function CheckboxCards() {
  const [values, setValues] = useState({
    Toys: false,
    Books: false,
    Clothes: false,
  })

  // Note: debounce is used to prevent multiple state updates that could toggle previous values
  const toggleValues = debounce((values: any) => {
    setValues((prev) => ({ ...prev, ...values }))
  }, 10)

  return (
    <View width="100%" items="center">
      <Checkboxes
        minW="100%"
        gap="4"
        py="@max-md/window:6"
        values={values}
        onValuesChange={(values) => toggleValues(values)}
      >
        <Checkboxes.FocusGroup width="100%" flexDirection="row" gap="3" flexWrap="wrap">
          {packages.map((item) => (
            <Checkboxes.FocusGroup.Item
              value={item.title}
              key={item.title}
              maxW="100% @md/window:49%"
              minW="100% @md/window:49%"
            >
              <Checkboxes.Card flex={1} flexBasis="auto" minW="100%" gap="6">
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
                      theme={item.color}
                    >
                      <View width={10} height={10} bg="color-9" rounded={100} />
                      <Text fontSize="3" color="color-10">
                        {item.title}
                      </Text>
                    </View>

                    <Checkboxes.Checkbox>
                      <Checkboxes.Checkbox.Indicator>
                        <Check />
                      </Checkboxes.Checkbox.Indicator>
                    </Checkboxes.Checkbox>
                  </View>
                  <Text fontSize="3" theme="level2">
                    {item.description}
                  </Text>
                </View>

                <View flexDirection="row" gap="2" mt="auto" items="center">
                  <Clock color="color-9" size={14} />
                  <Text opacity={0.5} fontSize="3" fontWeight="300" theme="level3">
                    last bought 2 hr ago
                  </Text>
                </View>
              </Checkboxes.Card>
            </Checkboxes.FocusGroup.Item>
          ))}
        </Checkboxes.FocusGroup>
      </Checkboxes>
    </View>
  )
}

CheckboxCards.fileName = 'CheckboxCards'
