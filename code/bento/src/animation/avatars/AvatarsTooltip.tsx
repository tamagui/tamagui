import { Avatar } from '../../BentoSkins'
import type { SizeTokens } from 'tamagui'
import { Paragraph, Tooltip, View, styled, withStaticProperties } from 'tamagui'

const items = ['Developer', 'User', 'Athlete', 'User', 'Designer']

/** ------ EXAMPLE ------ */
export function AvatarsTooltip() {
  return (
    <View gap="6">
      <View flexDirection="row">
        {items.map((item, index) => (
          <View
            ml={index !== 0 ? '-2' : undefined}
            z="hover:1px"
            scale="hover:1.05"
            cursor="pointer"
            key={`${item}-${index}`}
            style={{ transition: 'transform 150ms ease' }}
          >
            <AvatarTip offset={5} placement="bottom" restMs={0} delay={0}>
              <AvatarTip.Trigger>
                <Item size="4" imageUrl={`https://i.pravatar.cc/150?img=${index + 10}`} />
              </AvatarTip.Trigger>
              <AvatarTip.Content elevation={2} transformOrigin="center top">
                <AvatarTip.Arrow />
                <Paragraph size="2" lineHeight="1">
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
            ml={index !== 0 ? '-4' : undefined}
            z="hover:1px"
            scale="hover:1.05"
            cursor="pointer"
            key={`${item}-${index}`}
            style={{ transition: 'transform 150ms ease' }}
          >
            <AvatarTip offset={5} placement="bottom" delay={0}>
              <AvatarTip.Trigger>
                <Item size="6" imageUrl={`https://i.pravatar.cc/150?img=${index + 10}`} />
              </AvatarTip.Trigger>
              <AvatarTip.Content elevation={2} transformOrigin="center top">
                <AvatarTip.Arrow />
                <Paragraph size="2" lineHeight="1">
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
    <Avatar borderWidth="1" borderColor="color-1" circular size={size}>
      <Avatar.Image src={imageUrl} />
      <Avatar.Fallback bg="background" />
    </Avatar>
  )
}

const AvatarTooltipContent = styled(Tooltip.Content, {
  scale: '1 enter:0.9 exit:0.9',
  x: '0 enter:0 exit:0',
  y: '0 enter:-5px exit:-5px',
  opacity: '1 enter:0 exit:0',
  transition: [
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
