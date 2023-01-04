import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberSquareFiveBold } from '../bold/number-square-five-bold'
import { NumberSquareFiveDuotone } from '../duotone/number-square-five-duotone'
import { NumberSquareFiveFill } from '../fill/number-square-five-fill'
import { NumberSquareFiveLight } from '../light/number-square-five-light'
import { NumberSquareFiveRegular } from '../regular/number-square-five-regular'
import { NumberSquareFiveThin } from '../thin/number-square-five-thin'

const weightMap = {
  regular: NumberSquareFiveRegular,
  bold: NumberSquareFiveBold,
  duotone: NumberSquareFiveDuotone,
  fill: NumberSquareFiveFill,
  light: NumberSquareFiveLight,
  thin: NumberSquareFiveThin,
} as const

export const NumberSquareFive = (props: IconProps) => {
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
