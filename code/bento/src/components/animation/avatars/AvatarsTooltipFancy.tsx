import { useEffect, useRef, useState } from 'react'
import type { SizeTokens, TamaguiElement } from 'tamagui'
import {
  Avatar,
  Paragraph,
  Tooltip,
  View,
  isWeb,
  styled,
  withStaticProperties,
} from 'tamagui'

const items = ['Developer', 'User', 'Athlete', 'User', 'Designer']

/** ------ EXAMPLE ------ */
export function AvatarsTooltipFancy() {
  return (
    <View gap="$6">
      <View flexDirection="row">
        {items.map((item, index) => (
          <Item item={item} index={index} key={item} />
        ))}
      </View>
    </View>
  )
}

AvatarsTooltipFancy.fileName = 'AvatarsTooltipFancy'

function Item(props: { item: string; index: number }) {
  const { item, index } = props
  const [innerRef, setInnerRef] = useState<TamaguiElement | null>(null)
  const [outerRef, setOuterRef] = useState<TamaguiElement | null>(null)
  const [position, setPosition] = useState({ degree: '0deg', x: 0 })

  useCircleInteraction(innerRef, outerRef, ({ degree, x }) => {
    setPosition({ degree, x })
  })

  return (
    <View
      marginLeft={index !== 0 ? '$-4' : undefined}
      zIndex={index}
      key={item}
      cursor="pointer"
    >
      <AvatarTip offset={5} placement="top" delay={0}>
        <AvatarTip.Trigger>
          <Avatar
            ref={setInnerRef}
            borderWidth="$1"
            borderColor="$color1"
            circular
            size="$6"
          >
            <Avatar.Image src={`/avatars/300.jpeg`} />
            <Avatar.Fallback backgroundColor="$background" />
          </Avatar>
        </AvatarTip.Trigger>
        <AvatarTip.Content
          ref={setOuterRef}
          elevation={8}
          x={position.x / 2}
          rotate={position.degree}
          transformOrigin="center bottom"
        >
          <Paragraph size="$2" lineHeight="$1" paddingHorizontal="$2">
            {item}
          </Paragraph>
        </AvatarTip.Content>
      </AvatarTip>
    </View>
  )
}

const AvatarTooltipContent = styled(Tooltip.Content, {
  enterStyle: { x: 0, y: 15, opacity: 0, scale: 0.9 },
  exitStyle: { x: 0, y: 15, opacity: 0, scale: 0.9 },
  scale: 1,
  x: 0,
  y: 0,
  opacity: 1,
  animation: [
    'bouncy',
    {
      opacity: {
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

function useCircleInteraction(
  innerRef: any,
  outerRef: any,
  callback: (arg0: { degree: string; x: number }) => void
) {
  if (!isWeb) return
  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      const innerRect = innerRef.getBoundingClientRect()
      const circleCenterX = innerRect.left + innerRect.width / 2
      const circleWidth = innerRect.width

      const relativeX = event.clientX - circleCenterX

      let degree = (relativeX / (circleWidth / 2)) * -15

      if (degree > 15) {
        degree = 15
      } else if (degree < -15) {
        degree = -15
      }

      degree /= 2

      if (typeof callback === 'function') {
        callback({ degree: degree + 'deg', x: -relativeX })
      }
    }
    if (innerRef && outerRef) {
      innerRef.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (innerRef && outerRef) {
        innerRef.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [innerRef, callback])
}
