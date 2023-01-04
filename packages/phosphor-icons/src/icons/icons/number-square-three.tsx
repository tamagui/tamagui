import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberSquareThreeBold } from '../bold/number-square-three-bold'
import { NumberSquareThreeDuotone } from '../duotone/number-square-three-duotone'
import { NumberSquareThreeFill } from '../fill/number-square-three-fill'
import { NumberSquareThreeLight } from '../light/number-square-three-light'
import { NumberSquareThreeRegular } from '../regular/number-square-three-regular'
import { NumberSquareThreeThin } from '../thin/number-square-three-thin'

const weightMap = {
  regular: NumberSquareThreeRegular,
  bold: NumberSquareThreeBold,
  duotone: NumberSquareThreeDuotone,
  fill: NumberSquareThreeFill,
  light: NumberSquareThreeLight,
  thin: NumberSquareThreeThin,
} as const

export const NumberSquareThree = (props: IconProps) => {
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
