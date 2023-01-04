import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChatsTeardropBold } from '../bold/chats-teardrop-bold'
import { ChatsTeardropDuotone } from '../duotone/chats-teardrop-duotone'
import { ChatsTeardropFill } from '../fill/chats-teardrop-fill'
import { ChatsTeardropLight } from '../light/chats-teardrop-light'
import { ChatsTeardropRegular } from '../regular/chats-teardrop-regular'
import { ChatsTeardropThin } from '../thin/chats-teardrop-thin'

const weightMap = {
  regular: ChatsTeardropRegular,
  bold: ChatsTeardropBold,
  duotone: ChatsTeardropDuotone,
  fill: ChatsTeardropFill,
  light: ChatsTeardropLight,
  thin: ChatsTeardropThin,
} as const

export const ChatsTeardrop = (props: IconProps) => {
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
