import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChatCircleBold } from '../bold/chat-circle-bold'
import { ChatCircleDuotone } from '../duotone/chat-circle-duotone'
import { ChatCircleFill } from '../fill/chat-circle-fill'
import { ChatCircleLight } from '../light/chat-circle-light'
import { ChatCircleRegular } from '../regular/chat-circle-regular'
import { ChatCircleThin } from '../thin/chat-circle-thin'

const weightMap = {
  regular: ChatCircleRegular,
  bold: ChatCircleBold,
  duotone: ChatCircleDuotone,
  fill: ChatCircleFill,
  light: ChatCircleLight,
  thin: ChatCircleThin,
} as const

export const ChatCircle = (props: IconProps) => {
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
