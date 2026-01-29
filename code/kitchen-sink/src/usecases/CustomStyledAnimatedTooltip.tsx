import {
  View,
  Tooltip as TamaguiTooltip,
  Text,
  Theme,
  styled,
  withStaticProperties,
} from 'tamagui'

const StyledTooltip = styled(TamaguiTooltip, {
  delay: 0,
  restMs: 0,
  allowFlip: true,
  stayInFrame: {
    mainAxis: true,
  },
  placement: 'top',
})

export const Tooltip = withStaticProperties(StyledTooltip, {
  ...TamaguiTooltip,
  Content: styled(TamaguiTooltip.Content, {
    padding: 0,
    px: 8,
    zIndex: 1_000_000,
    rounded: 6,
    bg: '$color1',
    enterStyle: { x: 0, y: 5, opacity: 0, scale: 0.9 },
    exitStyle: { x: 0, y: 5, opacity: 0, scale: 0.9 },
    scale: 1,
    x: 0,
    y: 0,
    opacity: 1,
    transition: [
      'quick',
      {
        opacity: {
          overshootClamping: true,
        },
      },
    ],
  }),
})

const TriggerText = styled(Text, {
  fontFamily: '$body',
  bg: '$color3',
  p: '$3',
  color: '$color10',
})

export function CustomStyledAnimatedTooltip() {
  return (
    <View flex={1} items="center" justify="center" gap="$5">
      <View theme="red">
        <Tooltip>
          <Tooltip.Trigger>
            <TriggerText>No animation with styled()</TriggerText>
          </Tooltip.Trigger>

          <Theme name="accent">
            <Tooltip.Content>
              <Text theme="red" color="$color11">
                Hey there!
              </Text>
            </Tooltip.Content>
          </Theme>
        </Tooltip>
      </View>
    </View>
  )
}
