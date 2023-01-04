import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TextStrikethroughBold } from '../bold/text-strikethrough-bold'
import { TextStrikethroughDuotone } from '../duotone/text-strikethrough-duotone'
import { TextStrikethroughFill } from '../fill/text-strikethrough-fill'
import { TextStrikethroughLight } from '../light/text-strikethrough-light'
import { TextStrikethroughRegular } from '../regular/text-strikethrough-regular'
import { TextStrikethroughThin } from '../thin/text-strikethrough-thin'

const weightMap = {
  regular: TextStrikethroughRegular,
  bold: TextStrikethroughBold,
  duotone: TextStrikethroughDuotone,
  fill: TextStrikethroughFill,
  light: TextStrikethroughLight,
  thin: TextStrikethroughThin,
} as const

export const TextStrikethrough = (props: IconProps) => {
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
