import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CalculatorBold } from '../bold/calculator-bold'
import { CalculatorDuotone } from '../duotone/calculator-duotone'
import { CalculatorFill } from '../fill/calculator-fill'
import { CalculatorLight } from '../light/calculator-light'
import { CalculatorRegular } from '../regular/calculator-regular'
import { CalculatorThin } from '../thin/calculator-thin'

const weightMap = {
  regular: CalculatorRegular,
  bold: CalculatorBold,
  duotone: CalculatorDuotone,
  fill: CalculatorFill,
  light: CalculatorLight,
  thin: CalculatorThin,
} as const

export const Calculator = (props: IconProps) => {
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
