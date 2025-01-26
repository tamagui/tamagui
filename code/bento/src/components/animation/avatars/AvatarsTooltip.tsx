import type { SizeTokens } from 'tamagui'
import { Avatar, Paragraph, Tooltip, View, styled, withStaticProperties } from 'tamagui'

const items = ['Developer', 'User', 'Athlete', 'User', 'Designer']

/** ------ EXAMPLE ------ */
export function AvatarsTooltip() {
  return (
    <View gap="$6">
      <View flexDirection="row">
        {items.map((item, index) => (
          <View
            marginLeft={index !== 0 ? '$-2' : undefined}
            key={item}
            hoverStyle={{
              zIndex: 1,
              scale: 1.05,
            }}
            animation="bouncy"
            cursor="pointer"
          >
            <AvatarTip offset={5} placement="bottom" restMs={0} delay={0}>
              <AvatarTip.Trigger>
                <Item size="$4" imageUrl={`/avatars/300.jpeg`} />
              </AvatarTip.Trigger>
              <AvatarTip.Content elevation={2} transformOrigin="center top">
                <AvatarTip.Arrow />
                <Paragraph size="$2" lineHeight="$1">
                  {item}
                </Paragraph>
              </AvatarTip.Content>
            </AvatarTip>
          </View>
        ))}
      </View>
      <View flexDirection="row">
        {items.map((item, index) => (
          <View
            marginLeft={index !== 0 ? '$-4' : undefined}
            key={item}
            hoverStyle={{
              zIndex: 1,
              scale: 1.05,
            }}
            animation="bouncy"
            cursor="pointer"
          >
            <AvatarTip offset={5} placement="bottom" delay={0}>
              <AvatarTip.Trigger>
                <Item size="$6" imageUrl={`/avatars/300.jpeg`} />
              </AvatarTip.Trigger>
              <AvatarTip.Content elevation={2} transformOrigin="center top">
                <AvatarTip.Arrow />
                <Paragraph size="$2" lineHeight="$1">
                  {item}
                </Paragraph>
              </AvatarTip.Content>
            </AvatarTip>
          </View>
        ))}
      </View>
    </View>
  )
}

AvatarsTooltip.fileName = 'AvatarsTooltip'

function Item({ imageUrl, size }: { imageUrl: string; size: SizeTokens }) {
  return (
    <Avatar borderWidth="$1" borderColor="$color1" circular size={size}>
      <Avatar.Image src={imageUrl} />
      <Avatar.Fallback backgroundColor="$background" />
    </Avatar>
  )
}

const AvatarTooltipContent = styled(Tooltip.Content, {
  enterStyle: { x: 0, y: -5, opacity: 0, scale: 0.9 },
  exitStyle: { x: 0, y: -5, opacity: 0, scale: 0.9 },
  scale: 1,
  x: 0,
  y: 0,
  opacity: 1,
  animation: [
    '100ms',
    {
      y: {
        overshootClamping: true,
      },
    },
  ],
})

const AvatarTip = withStaticProperties(Tooltip, {
  Trigger: Tooltip.Trigger,
  Content: AvatarTooltipContent,
  Arrow: Tooltip.Arrow,
})
