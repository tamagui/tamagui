import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BracketsAngleBold } from '../bold/brackets-angle-bold'
import { BracketsAngleDuotone } from '../duotone/brackets-angle-duotone'
import { BracketsAngleFill } from '../fill/brackets-angle-fill'
import { BracketsAngleLight } from '../light/brackets-angle-light'
import { BracketsAngleRegular } from '../regular/brackets-angle-regular'
import { BracketsAngleThin } from '../thin/brackets-angle-thin'

const weightMap = {
  regular: BracketsAngleRegular,
  bold: BracketsAngleBold,
  duotone: BracketsAngleDuotone,
  fill: BracketsAngleFill,
  light: BracketsAngleLight,
  thin: BracketsAngleThin,
} as const

export const BracketsAngle = (props: IconProps) => {
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
