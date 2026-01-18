import {
  blue,
  blueDark,
  gray,
  grayDark,
  green,
  greenDark,
  red,
  redDark,
  yellow,
  yellowDark,
} from '@tamagui/colors'
import { H2, Paragraph, Separator, Square, XStack, YStack } from 'tamagui'

const colorGroups = ['gray', 'blue', 'green', 'yellow', 'red'] as const

const lightColors = {
  gray,
  blue,
  green,
  yellow,
  red,
}

const darkColors = {
  gray: grayDark,
  blue: blueDark,
  green: greenDark,
  yellow: yellowDark,
  red: redDark,
}

export function ColorsDemo() {
  return (
    <YStack mt="$4" gap="$8">
      <ColorsRow title="Light" colorSets={lightColors} />
      <Separator />
      <ColorsRow title="Dark" colorSets={darkColors} />
    </YStack>
  )
}

type ColorSet = Record<string, string>

function ColorsRow({
  title,
  colorSets,
}: {
  title: string
  colorSets: Record<(typeof colorGroups)[number], ColorSet>
}) {
  return (
    <YStack gap="$4" $sm={{ gap: '$2' }}>
      <H2 size="$2">{title}</H2>

      <XStack gap="$4" self="center">
        <YStack gap="$4" $sm={{ gap: '$2' }} self="center">
          {colorGroups.map((groupName) => {
            const colorSet = colorSets[groupName]
            const colors = Object.values(colorSet)
            return (
              <XStack gap="$2" key={groupName}>
                {colors.map((color, index) => {
                  return (
                    <Square
                      key={`${groupName}${index}`}
                      rounded="$2"
                      size="$4"
                      height="$4"
                      borderWidth={1}
                      bg={color as any}
                      borderColor="$color7"
                      $sm={{
                        size: '$2',
                      }}
                      $xs={{
                        size: '$1',
                      }}
                    />
                  )
                })}
              </XStack>
            )
          })}

          <XStack gap="$2" self="center">
            {new Array(13)
              .fill(0)
              .slice(1)
              .map((_, index) => {
                return (
                  <Paragraph
                    color="$color10"
                    text="center"
                    width="$4"
                    $sm={{
                      width: '$2',
                    }}
                    $xs={{
                      width: '$1',
                    }}
                    key={index}
                  >
                    {index}
                  </Paragraph>
                )
              })}
          </XStack>
        </YStack>

        <YStack gap="$4" mt="$2">
          {colorGroups.map((name) => (
            <Paragraph
              theme={name as any}
              color="$color10"
              height="$4"
              rotate="-10deg"
              $sm={{
                height: '$2',
              }}
              $xs={{
                height: '$1',
              }}
              key={name}
            >
              {name}
            </Paragraph>
          ))}
        </YStack>
      </XStack>
    </YStack>
  )
}
