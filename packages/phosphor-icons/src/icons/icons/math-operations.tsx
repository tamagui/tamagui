import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MathOperationsBold } from '../bold/math-operations-bold'
import { MathOperationsDuotone } from '../duotone/math-operations-duotone'
import { MathOperationsFill } from '../fill/math-operations-fill'
import { MathOperationsLight } from '../light/math-operations-light'
import { MathOperationsRegular } from '../regular/math-operations-regular'
import { MathOperationsThin } from '../thin/math-operations-thin'

const weightMap = {
  regular: MathOperationsRegular,
  bold: MathOperationsBold,
  duotone: MathOperationsDuotone,
  fill: MathOperationsFill,
  light: MathOperationsLight,
  thin: MathOperationsThin,
} as const

export const MathOperations = (props: IconProps) => {
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
