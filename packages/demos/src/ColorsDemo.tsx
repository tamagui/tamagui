import { Variable } from '@tamagui/core'
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
    <YStack mt="$4" space="$8">
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

      <XStack space als="center">
        <YStack space $sm={{ space: '$2' }} als="center">
          {colors.map((group, index) => {
            return (
              <XStack space="$2" key={index}>
                {group.map((color) => {
                  return (
                    <Square
                      key={`${color.key}${index}`}
                      br="$2"
                      size="$4"
                      h="$4"
                      bc={getVariableValue(color)}
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

          <XStack space="$2" als="center">
            {new Array(13)
              .fill(0)
              .slice(1)
              .map((_, index) => {
                return (
                  <Paragraph
                    col="$color10"
                    ta="center"
                    w="$4"
                    $sm={{
                      w: '$2',
                    }}
                    $xs={{
                      w: '$1',
                    }}
                    key={index}
                  >
                    {index}
                  </Paragraph>
                )
              })}
          </XStack>
        </YStack>

        <YStack space="$4" mt="$2">
          {colorGroups.map((name) => (
            <Paragraph
              theme={name as any}
              col="$color10"
              h="$4"
              rotate="-10deg"
              $sm={{
                h: '$2',
              }}
              $xs={{
                h: '$1',
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
