import type { Variable } from '@tamagui/core'
import {
  H2,
  Paragraph,
  Separator,
  Square,
  XStack,
  YStack,
  getTokens,
  getVariableValue,
} from 'tamagui'

const colorGroups = ['orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red']

export function ColorsDemo() {
  const colors = getTokens({ prefixed: false }).color
  const [colorsLight, colorsDark] = [getColors(colors), getColors(colors, true)]

  return (
    <YStack marginTop="$4" space="$8">
      <ColorsRow title="Light" colors={colorsLight} />
      <Separator />
      <ColorsRow title="Dark" colors={colorsDark} />
    </YStack>
  )
}

function ColorsRow({ title, colors }: { title: string; colors: Variable[][] }) {
  return (
    <YStack space $sm={{ space: '$2' }}>
      <H2 size="$2">{title}</H2>

      <XStack space alignSelf="center">
        <YStack space $sm={{ space: '$2' }} alignSelf="center">
          {colors.map((group, index) => {
            return (
              <XStack gap="$2" key={index}>
                {group.map((color) => {
                  return (
                    <Square
                      key={`${color.key}${index}`}
                      borderRadius="$2"
                      size="$4"
                      height="$4"
                      borderWidth={1}
                      backgroundColor={getVariableValue(color)}
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

          <XStack gap="$2" alignSelf="center">
            {new Array(13)
              .fill(0)
              .slice(1)
              .map((_, index) => {
                return (
                  <Paragraph
                    color="$color10"
                    textAlign="center"
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

        <YStack gap="$4" marginTop="$2">
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

function getColors(colors: Record<string, Variable>, dark = false) {
  return colorGroups.map((group) => {
    return Object.keys(colors)
      .filter(
        (color) =>
          color.startsWith(group) &&
          (dark ? color.endsWith('Dark') : !color.endsWith('Dark'))
      )
      .map((key) => colors[key])
  })
}
