import { Check, Clock } from '@tamagui/lucide-icons'
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
    <View width="100%" ai="center">
      <Checkboxes
        minWidth="100%"
        values={values}
        onValuesChange={(values) => toggleValues(values)}
        gap="$4"
        $group-window-sm={{
          paddingVertical: '$6',
        }}
      >
        {/* <Checkboxes.Title>Select your Gift</Checkboxes.Title> */}

        <Checkboxes.FocusGroup width="100%" flexDirection="row" gap="$3" flexWrap="wrap">
          {packages.map((item) => (
            <Checkboxes.FocusGroup.Item
              value={item.title}
              key={item.title}
              maxWidth="100%"
              minWidth="100%"
              $group-window-gtSm={{
                maxWidth: '49%',
                minWidth: '49%',
              }}
            >
              <Checkboxes.Card flex={1} minWidth="100%" gap="$6">
                <View f={1} flexDirection="column" gap="$3">
                  <View flexDirection="row" justifyContent="space-between">
                    <View
                      flexDirection="row"
                      theme={item.color}
                      backgroundColor="$color6"
                      borderRadius="$4"
                      alignItems="center"
                      justifyContent="center"
                      gap="$2"
                      py="$2"
                      px="$3"
                    >
                      <View
                        width={10}
                        height={10}
                        backgroundColor="$color10"
                        borderRadius={100}
                      />
                      <Text fontSize="$3" color="$color11">
                        {item.title}
                      </Text>
                    </View>

                    <Checkboxes.Checkbox>
                      <Checkboxes.Checkbox.Indicator>
                        <Check />
                      </Checkboxes.Checkbox.Indicator>
                    </Checkboxes.Checkbox>
                  </View>
                  <Text fontSize="$3" theme="alt1">
                    {item.description}
                  </Text>
                </View>

                <View flexDirection="row" gap="$2" marginTop="auto" alignItems="center">
                  <Clock color="$color10" size={14} />
                  <Text o={0.7} fontSize="$3" fontWeight="300" theme="alt2">
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
