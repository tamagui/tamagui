import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberSquareTwoBold } from '../bold/number-square-two-bold'
import { NumberSquareTwoDuotone } from '../duotone/number-square-two-duotone'
import { NumberSquareTwoFill } from '../fill/number-square-two-fill'
import { NumberSquareTwoLight } from '../light/number-square-two-light'
import { NumberSquareTwoRegular } from '../regular/number-square-two-regular'
import { NumberSquareTwoThin } from '../thin/number-square-two-thin'

const weightMap = {
  regular: NumberSquareTwoRegular,
  bold: NumberSquareTwoBold,
  duotone: NumberSquareTwoDuotone,
  fill: NumberSquareTwoFill,
  light: NumberSquareTwoLight,
  thin: NumberSquareTwoThin,
} as const

export const NumberSquareTwo = (props: IconProps) => {
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
