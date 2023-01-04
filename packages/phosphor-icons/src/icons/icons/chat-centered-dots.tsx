import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChatCenteredDotsBold } from '../bold/chat-centered-dots-bold'
import { ChatCenteredDotsDuotone } from '../duotone/chat-centered-dots-duotone'
import { ChatCenteredDotsFill } from '../fill/chat-centered-dots-fill'
import { ChatCenteredDotsLight } from '../light/chat-centered-dots-light'
import { ChatCenteredDotsRegular } from '../regular/chat-centered-dots-regular'
import { ChatCenteredDotsThin } from '../thin/chat-centered-dots-thin'

const weightMap = {
  regular: ChatCenteredDotsRegular,
  bold: ChatCenteredDotsBold,
  duotone: ChatCenteredDotsDuotone,
  fill: ChatCenteredDotsFill,
  light: ChatCenteredDotsLight,
  thin: ChatCenteredDotsThin,
} as const

export const ChatCenteredDots = (props: IconProps) => {
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
