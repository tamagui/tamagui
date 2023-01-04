import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChatTextBold } from '../bold/chat-text-bold'
import { ChatTextDuotone } from '../duotone/chat-text-duotone'
import { ChatTextFill } from '../fill/chat-text-fill'
import { ChatTextLight } from '../light/chat-text-light'
import { ChatTextRegular } from '../regular/chat-text-regular'
import { ChatTextThin } from '../thin/chat-text-thin'

const weightMap = {
  regular: ChatTextRegular,
  bold: ChatTextBold,
  duotone: ChatTextDuotone,
  fill: ChatTextFill,
  light: ChatTextLight,
  thin: ChatTextThin,
} as const

export const ChatText = (props: IconProps) => {
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
