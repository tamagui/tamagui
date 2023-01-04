import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChatsCircleBold } from '../bold/chats-circle-bold'
import { ChatsCircleDuotone } from '../duotone/chats-circle-duotone'
import { ChatsCircleFill } from '../fill/chats-circle-fill'
import { ChatsCircleLight } from '../light/chats-circle-light'
import { ChatsCircleRegular } from '../regular/chats-circle-regular'
import { ChatsCircleThin } from '../thin/chats-circle-thin'

const weightMap = {
  regular: ChatsCircleRegular,
  bold: ChatsCircleBold,
  duotone: ChatsCircleDuotone,
  fill: ChatsCircleFill,
  light: ChatsCircleLight,
  thin: ChatsCircleThin,
} as const

export const ChatsCircle = (props: IconProps) => {
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
