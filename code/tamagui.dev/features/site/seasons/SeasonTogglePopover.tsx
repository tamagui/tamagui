import {
  TamaguiLogo,
  setTintFamily,
  useTint,
  getTints,
  type TintFamily,
} from '@tamagui/logo'
import { Popover, SizableText, Square, View, XStack, YStack } from 'tamagui'

// colors match the theme families in tints.tsx
const seasonColors = {
  tamagui: '#ECD20A', // yellow (default)
  easter: '#ECD20A', // yellow
  xmas: '#ff3333', // red
  lunar: '#ff3333', // red
  valentine: '#ff3333', // red
  halloween: '#ECD20A', // yellow
  stpatricks: '#22c55e', // green
}

export const seasons = {
  tamagui: '🐤',
  easter: '🐣',
  xmas: '🎅🏻',
  lunar: '🧧',
  valentine: '💘',
  halloween: '🎃',
  stpatricks: '🍀',
}

export const seasonLogos = {
  tamagui: <TamaguiLogo downscale={2} color={seasonColors.tamagui} />,
  easter: <TamaguiLogo downscale={2} color={seasonColors.easter} />,
  xmas: <TamaguiLogo downscale={2} color={seasonColors.xmas} />,
  lunar: <TamaguiLogo downscale={2} color={seasonColors.lunar} />,
  valentine: <TamaguiLogo downscale={2} color={seasonColors.valentine} />,
  halloween: <TamaguiLogo downscale={2} color={seasonColors.halloween} />,
  stpatricks: <TamaguiLogo downscale={2} color={seasonColors.stpatricks} />,
}

const seasonKeys = [
  'xmas',
  'easter',
  'halloween',
  'valentine',
  'lunar',
  'stpatricks',
] as const

// mini logo letters component that shows season colors (used in Header SeasonChooser)
export const SeasonLogoWords = ({
  family,
  scale = 1,
}: { family: TintFamily; scale?: number }) => {
  const { families } = getTints()
  const tints = families[family]

  return (
    <XStack gap={1}>
      <svg width={38 * scale} height={14 * scale} viewBox="0 0 373 41">
        <polygon
          shapeRendering="crispEdges"
          fill={`var(--${tints[0]}9)`}
          points="24.3870968 40.1612903 24.3870968 8.67741935 32.2580645 8.67741935 32.2580645 0.806451613 0.774193548 0.806451613 0.774193548 8.67741935 8.64516129 8.67741935 8.64516129 40.1612903"
        />
        <path
          shapeRendering="crispEdges"
          fill={`var(--${tints[1]}9)`}
          d="M87.3548387,0.806451613 L87.3548387,8.67741935 L95.2258065,8.67741935 L95.2258065,40.1612903 L79.483871,40.1612903 L79.483871,24.4193548 L71.6129032,24.4193548 L71.6129032,40.1612903 L55.8709677,40.1612903 L55.8709677,8.67741935 L63.7419355,8.67741935 L63.7419355,0.806451613 L87.3548387,0.806451613 Z M79.483871,8.67741935 L71.6129032,8.67741935 L71.6129032,16.5483871 L79.483871,16.5483871 L79.483871,8.67741935 Z"
          fillRule="nonzero"
        />
        <polygon
          shapeRendering="crispEdges"
          fill={`var(--${tints[2]}9)`}
          points="130.645161 40.1612903 130.645161 22.4516129 138.516129 22.4516129 138.516129 40.1612903 154.258065 40.1612903 154.258065 0.806451613 142.451613 0.806451613 142.451613 8.67741935 126.709677 8.67741935 126.709677 0.806451613 114.903226 0.806451613 114.903226 40.1612903"
        />
        <path
          fill={`var(--${tints[3]}9)`}
          d="M205.419355,0.806451613 L205.419355,8.67741935 L213.290323,8.67741935 L213.290323,40.1612903 L197.548387,40.1612903 L197.548387,24.4193548 L189.677419,24.4193548 L189.677419,40.1612903 L173.935484,40.1612903 L173.935484,8.67741935 L181.806452,8.67741935 L181.806452,0.806451613 L205.419355,0.806451613 Z M197.548387,8.67741935 L189.677419,8.67741935 L189.677419,16.5483871 L197.548387,16.5483871 L197.548387,8.67741935 Z"
          fillRule="nonzero"
        />
        <polygon
          shapeRendering="crispEdges"
          fill={`var(--${tints[4]}9)`}
          points="264.451613 40.1612903 264.451613 32.2903226 272.322581 32.2903226 272.322581 16.5483871 256.580645 16.5483871 256.580645 32.2903226 248.709677 32.2903226 248.709677 8.67741935 272.322581 8.67741935 272.322581 0.806451613 240.83871 0.806451613 240.83871 8.67741935 232.967742 8.67741935 232.967742 32.2903226 240.83871 32.2903226 240.83871 40.1612903"
        />
        <polygon
          shapeRendering="crispEdges"
          fill={`var(--${tints[5]}9)`}
          points="323.483871 40.1612903 323.483871 32.2903226 331.354839 32.2903226 331.354839 0.806451613 315.612903 0.806451613 315.612903 32.2903226 307.741935 32.2903226 307.741935 0.806451613 292 0.806451613 292 32.2903226 299.870968 32.2903226 299.870968 40.1612903"
        />
        <polygon
          shapeRendering="crispEdges"
          fill={`var(--${tints[6]}9)`}
          points="372.677419 40.1612903 372.677419 0.806451613 356.935484 0.806451613 356.935484 40.1612903"
        />
      </svg>
    </XStack>
  )
}

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
