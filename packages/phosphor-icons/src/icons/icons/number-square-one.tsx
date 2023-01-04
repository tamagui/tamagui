import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberSquareOneBold } from '../bold/number-square-one-bold'
import { NumberSquareOneDuotone } from '../duotone/number-square-one-duotone'
import { NumberSquareOneFill } from '../fill/number-square-one-fill'
import { NumberSquareOneLight } from '../light/number-square-one-light'
import { NumberSquareOneRegular } from '../regular/number-square-one-regular'
import { NumberSquareOneThin } from '../thin/number-square-one-thin'

const weightMap = {
  regular: NumberSquareOneRegular,
  bold: NumberSquareOneBold,
  duotone: NumberSquareOneDuotone,
  fill: NumberSquareOneFill,
  light: NumberSquareOneLight,
  thin: NumberSquareOneThin,
} as const

export const NumberSquareOne = (props: IconProps) => {
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
