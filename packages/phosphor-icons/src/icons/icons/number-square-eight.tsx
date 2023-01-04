import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberSquareEightBold } from '../bold/number-square-eight-bold'
import { NumberSquareEightDuotone } from '../duotone/number-square-eight-duotone'
import { NumberSquareEightFill } from '../fill/number-square-eight-fill'
import { NumberSquareEightLight } from '../light/number-square-eight-light'
import { NumberSquareEightRegular } from '../regular/number-square-eight-regular'
import { NumberSquareEightThin } from '../thin/number-square-eight-thin'

const weightMap = {
  regular: NumberSquareEightRegular,
  bold: NumberSquareEightBold,
  duotone: NumberSquareEightDuotone,
  fill: NumberSquareEightFill,
  light: NumberSquareEightLight,
  thin: NumberSquareEightThin,
} as const

export const NumberSquareEight = (props: IconProps) => {
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
