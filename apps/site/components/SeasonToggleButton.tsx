import { TamaguiLogo, setTintFamily, useTint } from '@tamagui/logo'
import {
  Button,
  ButtonProps,
  Circle,
  Popover,
  SizableText,
  Square,
  Text,
  YStack,
} from 'tamagui'

export const seasons = {
  tamagui: <TamaguiLogo downscale={2} />,
  easter: '🐣',
  xmas: '🎅🏻',
  halloween: '🎃',
}

export const SeasonToggleButton = (props: ButtonProps) => {
  const { name, tint, setNextTint } = useTint()

  return (
    <Popover hoverable>
      <Popover.Trigger>
        <Button
          size="$3"
          w={38}
          h={30}
          onPress={(e) => {
            setNextTint()
            e.stopPropagation()
          }}
          {...props}
          aria-label="Toggle theme"
          ov="hidden"
        >
          <Circle
            bw={1}
            boc="var(--color9)"
            m={2}
            size={12}
            backgroundColor={tint as any}
          />

          {name !== 'tamagui' && (
            <SizableText size="$8" pos="absolute" b={-10} r={-10} rotate="-10deg">
              {seasons[name]}
            </SizableText>
          )}
        </Button>
      </Popover.Trigger>

      <Popover.Content
        enterStyle={{ y: -6, o: 0 }}
        exitStyle={{ y: -6, o: 0 }}
        elevate
        p="$0"
        ov="hidden"
        br="$4"
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
                  bc: '$backgroundHover',
                }}
                pressStyle={{
                  bc: '$backgroundPress',
                }}
                {...(name === optionName && {
                  bc: '$color5',
                  hoverStyle: {
                    bc: '$color5',
                  },
                })}
                onPress={() => {
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
