import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberSquareNineBold } from '../bold/number-square-nine-bold'
import { NumberSquareNineDuotone } from '../duotone/number-square-nine-duotone'
import { NumberSquareNineFill } from '../fill/number-square-nine-fill'
import { NumberSquareNineLight } from '../light/number-square-nine-light'
import { NumberSquareNineRegular } from '../regular/number-square-nine-regular'
import { NumberSquareNineThin } from '../thin/number-square-nine-thin'

const weightMap = {
  regular: NumberSquareNineRegular,
  bold: NumberSquareNineBold,
  duotone: NumberSquareNineDuotone,
  fill: NumberSquareNineFill,
  light: NumberSquareNineLight,
  thin: NumberSquareNineThin,
} as const

export const NumberSquareNine = (props: IconProps) => {
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
