import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TextItalicBold } from '../bold/text-italic-bold'
import { TextItalicDuotone } from '../duotone/text-italic-duotone'
import { TextItalicFill } from '../fill/text-italic-fill'
import { TextItalicLight } from '../light/text-italic-light'
import { TextItalicRegular } from '../regular/text-italic-regular'
import { TextItalicThin } from '../thin/text-italic-thin'

const weightMap = {
  regular: TextItalicRegular,
  bold: TextItalicBold,
  duotone: TextItalicDuotone,
  fill: TextItalicFill,
  light: TextItalicLight,
  thin: TextItalicThin,
} as const

export const TextItalic = (props: IconProps) => {
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
