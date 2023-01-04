import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChatTeardropDotsBold } from '../bold/chat-teardrop-dots-bold'
import { ChatTeardropDotsDuotone } from '../duotone/chat-teardrop-dots-duotone'
import { ChatTeardropDotsFill } from '../fill/chat-teardrop-dots-fill'
import { ChatTeardropDotsLight } from '../light/chat-teardrop-dots-light'
import { ChatTeardropDotsRegular } from '../regular/chat-teardrop-dots-regular'
import { ChatTeardropDotsThin } from '../thin/chat-teardrop-dots-thin'

const weightMap = {
  regular: ChatTeardropDotsRegular,
  bold: ChatTeardropDotsBold,
  duotone: ChatTeardropDotsDuotone,
  fill: ChatTeardropDotsFill,
  light: ChatTeardropDotsLight,
  thin: ChatTeardropDotsThin,
} as const

export const ChatTeardropDots = (props: IconProps) => {
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
