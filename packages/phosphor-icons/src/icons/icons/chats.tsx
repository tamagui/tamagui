import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChatsBold } from '../bold/chats-bold'
import { ChatsDuotone } from '../duotone/chats-duotone'
import { ChatsFill } from '../fill/chats-fill'
import { ChatsLight } from '../light/chats-light'
import { ChatsRegular } from '../regular/chats-regular'
import { ChatsThin } from '../thin/chats-thin'

const weightMap = {
  regular: ChatsRegular,
  bold: ChatsBold,
  duotone: ChatsDuotone,
  fill: ChatsFill,
  light: ChatsLight,
  thin: ChatsThin,
} as const

export const Chats = (props: IconProps) => {
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
