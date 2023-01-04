import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberSquareSixBold } from '../bold/number-square-six-bold'
import { NumberSquareSixDuotone } from '../duotone/number-square-six-duotone'
import { NumberSquareSixFill } from '../fill/number-square-six-fill'
import { NumberSquareSixLight } from '../light/number-square-six-light'
import { NumberSquareSixRegular } from '../regular/number-square-six-regular'
import { NumberSquareSixThin } from '../thin/number-square-six-thin'

const weightMap = {
  regular: NumberSquareSixRegular,
  bold: NumberSquareSixBold,
  duotone: NumberSquareSixDuotone,
  fill: NumberSquareSixFill,
  light: NumberSquareSixLight,
  thin: NumberSquareSixThin,
} as const

export const NumberSquareSix = (props: IconProps) => {
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
