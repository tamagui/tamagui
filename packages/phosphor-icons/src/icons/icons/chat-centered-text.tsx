import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChatCenteredTextBold } from '../bold/chat-centered-text-bold'
import { ChatCenteredTextDuotone } from '../duotone/chat-centered-text-duotone'
import { ChatCenteredTextFill } from '../fill/chat-centered-text-fill'
import { ChatCenteredTextLight } from '../light/chat-centered-text-light'
import { ChatCenteredTextRegular } from '../regular/chat-centered-text-regular'
import { ChatCenteredTextThin } from '../thin/chat-centered-text-thin'

const weightMap = {
  regular: ChatCenteredTextRegular,
  bold: ChatCenteredTextBold,
  duotone: ChatCenteredTextDuotone,
  fill: ChatCenteredTextFill,
  light: ChatCenteredTextLight,
  thin: ChatCenteredTextThin,
} as const

export const ChatCenteredText = (props: IconProps) => {
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
