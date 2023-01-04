import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChatCenteredBold } from '../bold/chat-centered-bold'
import { ChatCenteredDuotone } from '../duotone/chat-centered-duotone'
import { ChatCenteredFill } from '../fill/chat-centered-fill'
import { ChatCenteredLight } from '../light/chat-centered-light'
import { ChatCenteredRegular } from '../regular/chat-centered-regular'
import { ChatCenteredThin } from '../thin/chat-centered-thin'

const weightMap = {
  regular: ChatCenteredRegular,
  bold: ChatCenteredBold,
  duotone: ChatCenteredDuotone,
  fill: ChatCenteredFill,
  light: ChatCenteredLight,
  thin: ChatCenteredThin,
} as const

export const ChatCentered = (props: IconProps) => {
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
