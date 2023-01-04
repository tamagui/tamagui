import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChatDotsBold } from '../bold/chat-dots-bold'
import { ChatDotsDuotone } from '../duotone/chat-dots-duotone'
import { ChatDotsFill } from '../fill/chat-dots-fill'
import { ChatDotsLight } from '../light/chat-dots-light'
import { ChatDotsRegular } from '../regular/chat-dots-regular'
import { ChatDotsThin } from '../thin/chat-dots-thin'

const weightMap = {
  regular: ChatDotsRegular,
  bold: ChatDotsBold,
  duotone: ChatDotsDuotone,
  fill: ChatDotsFill,
  light: ChatDotsLight,
  thin: ChatDotsThin,
} as const

export const ChatDots = (props: IconProps) => {
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
