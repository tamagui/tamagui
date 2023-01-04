import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberSquareZeroBold } from '../bold/number-square-zero-bold'
import { NumberSquareZeroDuotone } from '../duotone/number-square-zero-duotone'
import { NumberSquareZeroFill } from '../fill/number-square-zero-fill'
import { NumberSquareZeroLight } from '../light/number-square-zero-light'
import { NumberSquareZeroRegular } from '../regular/number-square-zero-regular'
import { NumberSquareZeroThin } from '../thin/number-square-zero-thin'

const weightMap = {
  regular: NumberSquareZeroRegular,
  bold: NumberSquareZeroBold,
  duotone: NumberSquareZeroDuotone,
  fill: NumberSquareZeroFill,
  light: NumberSquareZeroLight,
  thin: NumberSquareZeroThin,
} as const

export const NumberSquareZero = (props: IconProps) => {
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
