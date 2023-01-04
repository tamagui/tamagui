import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberSquareSevenBold } from '../bold/number-square-seven-bold'
import { NumberSquareSevenDuotone } from '../duotone/number-square-seven-duotone'
import { NumberSquareSevenFill } from '../fill/number-square-seven-fill'
import { NumberSquareSevenLight } from '../light/number-square-seven-light'
import { NumberSquareSevenRegular } from '../regular/number-square-seven-regular'
import { NumberSquareSevenThin } from '../thin/number-square-seven-thin'

const weightMap = {
  regular: NumberSquareSevenRegular,
  bold: NumberSquareSevenBold,
  duotone: NumberSquareSevenDuotone,
  fill: NumberSquareSevenFill,
  light: NumberSquareSevenLight,
  thin: NumberSquareSevenThin,
} as const

export const NumberSquareSeven = (props: IconProps) => {
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
