import { TamaguiLogo, setTintFamily, useTint } from '@tamagui/logo'
import { Popover, SizableText, Square, View, YStack } from 'tamagui'

export const seasons = {
  tamagui: <TamaguiLogo downscale={2} />,
  easter: '🐣',
  xmas: '🎅🏻',
  lunar: '🧧',
  valentine: '💘',
  halloween: '🎃',
}

export const SeasonTogglePopover = (props: { children: any }) => {
  const { name, tint, setNextTint } = useTint()

  return (
    <Popover hoverable offset={20}>
      <Popover.Trigger>
        <View>
          {props.children}

          {name !== 'tamagui' && (
            <SizableText size="$8" pos="absolute" b={-10} r={-10} rotate="-10deg">
              {seasons[name]}
            </SizableText>
          )}
        </View>
      </Popover.Trigger>

      <Popover.Content
        enterStyle={{ y: -6, o: 0 }}
        exitStyle={{ y: -6, o: 0 }}
        elevation="$4"
        p="$0"
        t="$2"
        ov="hidden"
        br="$8"
        animation={[
          'medium',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <YStack>
          {Object.keys(seasons).map((optionName) => {
            return (
              <Square
                key={optionName}
                size="$4"
                $sm={{ size: '$5' }}
                hoverStyle={{
                  bg: '$backgroundHover',
                }}
                pressStyle={{
                  bg: '$backgroundPress',
                }}
                {...(name === optionName && {
                  bg: '$color5',
                  hoverStyle: {
                    bg: '$color5',
                  },
                })}
                onPress={(e) => {
                  e.stopPropagation()
                  setTintFamily(optionName as any)
                }}
              >
                <SizableText size="$6" cursor="default">
                  {seasons[optionName]}
                </SizableText>
              </Square>
            )
          })}
        </YStack>
      </Popover.Content>
    </Popover>
  )
}
