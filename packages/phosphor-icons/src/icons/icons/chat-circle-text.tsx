import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChatCircleTextBold } from '../bold/chat-circle-text-bold'
import { ChatCircleTextDuotone } from '../duotone/chat-circle-text-duotone'
import { ChatCircleTextFill } from '../fill/chat-circle-text-fill'
import { ChatCircleTextLight } from '../light/chat-circle-text-light'
import { ChatCircleTextRegular } from '../regular/chat-circle-text-regular'
import { ChatCircleTextThin } from '../thin/chat-circle-text-thin'

const weightMap = {
  regular: ChatCircleTextRegular,
  bold: ChatCircleTextBold,
  duotone: ChatCircleTextDuotone,
  fill: ChatCircleTextFill,
  light: ChatCircleTextLight,
  thin: ChatCircleTextThin,
} as const

export const ChatCircleText = (props: IconProps) => {
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
