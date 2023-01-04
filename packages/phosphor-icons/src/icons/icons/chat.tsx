import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChatBold } from '../bold/chat-bold'
import { ChatDuotone } from '../duotone/chat-duotone'
import { ChatFill } from '../fill/chat-fill'
import { ChatLight } from '../light/chat-light'
import { ChatRegular } from '../regular/chat-regular'
import { ChatThin } from '../thin/chat-thin'

const weightMap = {
  regular: ChatRegular,
  bold: ChatBold,
  duotone: ChatDuotone,
  fill: ChatFill,
  light: ChatLight,
  thin: ChatThin,
} as const

export const Chat = (props: IconProps) => {
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
