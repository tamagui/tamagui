import { Popover, View, Text, Theme, styled } from 'tamagui'

export const Content = styled(Popover.Content, {
  padding: 0,
  zIndex: 1_000_000,
  scale: '1 enter:0.9 exit:0.9',
  x: '0 enter:0 exit:0',
  y: '0 enter:5px exit:5px',
  opacity: '1 enter:0 exit:0',
  transition: [
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
    <View flex={1} items="center" justify="center" gap="5">
      <View theme="red">
        <Popover>
          <Popover.Trigger>
            <Text>No animation with styled()</Text>
          </Popover.Trigger>

          <Theme name="accent">
            <Content>
              <Text theme="red" color="color11">
                Hey there!
              </Text>
            </Content>
          </Theme>
        </Popover>
      </View>
    </View>
  )
}
