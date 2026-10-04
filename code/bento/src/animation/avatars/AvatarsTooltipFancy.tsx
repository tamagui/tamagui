import { useEffect, useState } from 'react'
import type { TamaguiElement } from 'tamagui'
import {
  Paragraph,
  Tooltip,
  View,
  isWeb,
  styled,
  withStaticProperties,
  Avatar,
} from 'tamagui'

const items = ['Developer', 'User', 'Athlete', 'User', 'Designer']

/** ------ EXAMPLE ------ */
export function AvatarsTooltipFancy() {
  return (
    <View gap="6">
      <View flexDirection="row">
        {items.map((item, index) => (
          <Item item={item} index={index} key={`${item}-${index}`} />
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
    <View ml={index !== 0 ? '-4' : undefined} z={index} cursor="pointer">
      <AvatarTip offset={5} placement="top" delay={0}>
        <AvatarTip.Trigger>
          <Avatar
            ref={setInnerRef}
            borderWidth="1"
            borderColor="color-1"
            circular
            size="6"
          >
            <Avatar.Image src={`https://i.pravatar.cc/150?img=${index + 10}`} />
            <Avatar.Fallback bg="background" />
          </Avatar>
        </AvatarTip.Trigger>
        <AvatarTip.Content
          ref={setOuterRef}
          boxShadow="0 4px 24px shadow-color"
          x={position.x / 2}
          rotate={position.degree}
          transformOrigin="center bottom"
        >
          <Paragraph size="2" lineHeight="1" px="2">
            {item}
          </Paragraph>
        </AvatarTip.Content>
      </AvatarTip>
    </View>
  )
}

const AvatarTooltipContent = styled(Tooltip.Content, {
  scale: '1 enter:0.9 exit:0.9',
  x: '0 enter:0 exit:0',
  y: '0 enter:15px exit:15px',
  opacity: '1 enter:0 exit:0',
  transition: 'bouncy',
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
