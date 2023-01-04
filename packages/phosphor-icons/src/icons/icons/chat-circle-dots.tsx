import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChatCircleDotsBold } from '../bold/chat-circle-dots-bold'
import { ChatCircleDotsDuotone } from '../duotone/chat-circle-dots-duotone'
import { ChatCircleDotsFill } from '../fill/chat-circle-dots-fill'
import { ChatCircleDotsLight } from '../light/chat-circle-dots-light'
import { ChatCircleDotsRegular } from '../regular/chat-circle-dots-regular'
import { ChatCircleDotsThin } from '../thin/chat-circle-dots-thin'

const weightMap = {
  regular: ChatCircleDotsRegular,
  bold: ChatCircleDotsBold,
  duotone: ChatCircleDotsDuotone,
  fill: ChatCircleDotsFill,
  light: ChatCircleDotsLight,
  thin: ChatCircleDotsThin,
} as const

export const ChatCircleDots = (props: IconProps) => {
  const {
    color: contextColor,
    size: contextSize,
    weight: contextWeight,
    style: contextStyle,
  } = useContext(IconContext)

  const {
    color = contextColor ?? 'black',
    size = contextSize ?? 24,
    weight = contextWeight ?? 'regular',
    style = contextStyle ?? {},
    ...otherProps
  } = props

  const Component = weightMap[weight]

  return (
    <Component
      color={color}
      size={size}
      weight={weight}
      style={style}
      {...otherProps}
    />
  )
}
