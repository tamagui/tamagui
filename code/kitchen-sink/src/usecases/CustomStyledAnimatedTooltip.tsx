import {
  Stack,
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
    br: 6,
    bg: '$color1',
    enterStyle: { x: 0, y: 5, o: 0, scale: 0.9 },
    exitStyle: { x: 0, y: 5, o: 0, scale: 0.9 },
    scale: 1,
    x: 0,
    y: 0,
    o: 1,
    animation: [
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
    <Stack f={1} ai="center" jc="center" gap="$5">
      <Stack theme="red">
        <Tooltip>
          <Tooltip.Trigger>
            <TriggerText>No animation with styled()</TriggerText>
          </Tooltip.Trigger>

          <Theme inverse>
            <Tooltip.Content>
              <Text theme="red" color="$color11">
                Hey there!
              </Text>
            </Tooltip.Content>
          </Theme>
        </Tooltip>
      </Stack>

      <Stack theme="blue">
        {/* <TamaguiTooltip delay={0} restMs={0}>
          <TamaguiTooltip.Trigger>
            <TriggerText>This works with inline props</TriggerText>
          </TamaguiTooltip.Trigger>

          <Theme inverse>
            <TamaguiTooltip.Content
              {...{
                padding: 0,
                px: 8,
                zIndex: 1_000_000,
                br: 6,
                bg: '$color1',
                enterStyle: { x: 0, y: 5, o: 0, scale: 0.9 },
                exitStyle: { x: 0, y: 5, o: 0, scale: 0.9 },
                scale: 1,
                x: 0,
                y: 0,
                o: 1,
                animation: [
                  'quick',
                  {
                    opacity: {
                      overshootClamping: true,
                    },
                  },
                ],
              }}
            >
              <Text color="$color12">Hey there!</Text>
            </TamaguiTooltip.Content>
          </Theme>
        </TamaguiTooltip> */}
      </Stack>
    </Stack>
  )
}
