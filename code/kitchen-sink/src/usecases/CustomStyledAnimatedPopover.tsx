import { Popover, Stack, Text, Theme, styled } from 'tamagui'

export const Content = styled(Popover.Content, {
  padding: 0,
  zIndex: 1_000_000,
  enterStyle: { x: 0, y: 5, opacity: 0, scale: 0.9 },
  exitStyle: { x: 0, y: 5, opacity: 0, scale: 0.9 },
  scale: 1,
  x: 0,
  y: 0,
  opacity: 1,
  animation: [
    'quick',
    {
      opacity: {
        overshootClamping: true,
      },
    },
  ],
})

export function CustomStyledAnimatedPopover() {
  return (
    <Stack flex={1} items="center" justify="center" gap="$5">
      <Stack theme="red">
        <Popover>
          <Popover.Trigger>
            <Text>No animation with styled()</Text>
          </Popover.Trigger>

          <Theme name="accent">
            <Content>
              <Text theme="red" color="$color11">
                Hey there!
              </Text>
            </Content>
          </Theme>
        </Popover>
      </Stack>
    </Stack>
  )
}
