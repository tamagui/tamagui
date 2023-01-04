import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FunctionBold } from '../bold/function-bold'
import { FunctionDuotone } from '../duotone/function-duotone'
import { FunctionFill } from '../fill/function-fill'
import { FunctionLight } from '../light/function-light'
import { FunctionRegular } from '../regular/function-regular'
import { FunctionThin } from '../thin/function-thin'

const weightMap = {
  regular: FunctionRegular,
  bold: FunctionBold,
  duotone: FunctionDuotone,
  fill: FunctionFill,
  light: FunctionLight,
  thin: FunctionThin,
} as const

export const Function = (props: IconProps) => {
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
