import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChatTeardropTextBold } from '../bold/chat-teardrop-text-bold'
import { ChatTeardropTextDuotone } from '../duotone/chat-teardrop-text-duotone'
import { ChatTeardropTextFill } from '../fill/chat-teardrop-text-fill'
import { ChatTeardropTextLight } from '../light/chat-teardrop-text-light'
import { ChatTeardropTextRegular } from '../regular/chat-teardrop-text-regular'
import { ChatTeardropTextThin } from '../thin/chat-teardrop-text-thin'

const weightMap = {
  regular: ChatTeardropTextRegular,
  bold: ChatTeardropTextBold,
  duotone: ChatTeardropTextDuotone,
  fill: ChatTeardropTextFill,
  light: ChatTeardropTextLight,
  thin: ChatTeardropTextThin,
} as const

export const ChatTeardropText = (props: IconProps) => {
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
