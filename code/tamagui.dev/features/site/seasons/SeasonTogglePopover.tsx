import { TamaguiLogo, setTintFamily, useTint } from '@tamagui/logo'
import { Popover, SizableText, Square, View, YStack } from 'tamagui'

// colors match the theme families in tints.tsx
const seasonColors = {
  tamagui: '#ECD20A', // yellow (default)
  easter: '#ECD20A', // yellow
  xmas: '#ff3333', // red
  lunar: '#ff3333', // red
  valentine: '#ff3333', // red
  halloween: '#ECD20A', // yellow
}

export const seasons = {
  tamagui: <TamaguiLogo downscale={2} />,
  easter: '🐣',
  xmas: '🎅🏻',
  lunar: '🧧',
  valentine: '💘',
  halloween: '🎃',
}

export const seasonLogos = {
  tamagui: <TamaguiLogo downscale={2} color={seasonColors.tamagui} />,
  easter: <TamaguiLogo downscale={2} color={seasonColors.easter} />,
  xmas: <TamaguiLogo downscale={2} color={seasonColors.xmas} />,
  lunar: <TamaguiLogo downscale={2} color={seasonColors.lunar} />,
  valentine: <TamaguiLogo downscale={2} color={seasonColors.valentine} />,
  halloween: <TamaguiLogo downscale={2} color={seasonColors.halloween} />,
}

const seasonKeys = ['xmas', 'easter', 'halloween', 'valentine', 'lunar'] as const

export const SeasonTogglePopover = (props: { children: any }) => {
  const { name } = useTint()

  return (
    <Popover hoverable={{ delay: { open: 1000, close: 100 }, restMs: 1000 }} offset={20}>
      <Popover.Trigger>
        <View>
          {props.children}

          {/* seasonal emojis - all rendered, CSS controls visibility */}
          {seasonKeys.map((season) => (
            <SizableText
              key={season}
              className={`season-emoji season-emoji-${season}`}
              size="$8"
              position="absolute"
              b={-10}
              r={-10}
              rotate="-10deg"
            >
              {seasons[season]}
            </SizableText>
          ))}
        </View>
      </Popover.Trigger>

      <Popover.Content
        enterStyle={{ y: -6, opacity: 0 }}
        exitStyle={{ y: -6, opacity: 0 }}
        elevation="$4"
        p="$0"
        t="$2"
        overflow="hidden"
        rounded="$8"
        transition={[
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
