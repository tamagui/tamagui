import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GradientBold } from '../bold/gradient-bold'
import { GradientDuotone } from '../duotone/gradient-duotone'
import { GradientFill } from '../fill/gradient-fill'
import { GradientLight } from '../light/gradient-light'
import { GradientRegular } from '../regular/gradient-regular'
import { GradientThin } from '../thin/gradient-thin'

const weightMap = {
  regular: GradientRegular,
  bold: GradientBold,
  duotone: GradientDuotone,
  fill: GradientFill,
  light: GradientLight,
  thin: GradientThin,
} as const

export const Gradient = (props: IconProps) => {
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
