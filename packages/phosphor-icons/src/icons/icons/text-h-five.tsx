import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TextHFiveBold } from '../bold/text-h-five-bold'
import { TextHFiveDuotone } from '../duotone/text-h-five-duotone'
import { TextHFiveFill } from '../fill/text-h-five-fill'
import { TextHFiveLight } from '../light/text-h-five-light'
import { TextHFiveRegular } from '../regular/text-h-five-regular'
import { TextHFiveThin } from '../thin/text-h-five-thin'

const weightMap = {
  regular: TextHFiveRegular,
  bold: TextHFiveBold,
  duotone: TextHFiveDuotone,
  fill: TextHFiveFill,
  light: TextHFiveLight,
  thin: TextHFiveThin,
} as const

export const TextHFive = (props: IconProps) => {
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
