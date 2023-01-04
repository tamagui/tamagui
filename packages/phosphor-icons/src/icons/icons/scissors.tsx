import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ScissorsBold } from '../bold/scissors-bold'
import { ScissorsDuotone } from '../duotone/scissors-duotone'
import { ScissorsFill } from '../fill/scissors-fill'
import { ScissorsLight } from '../light/scissors-light'
import { ScissorsRegular } from '../regular/scissors-regular'
import { ScissorsThin } from '../thin/scissors-thin'

const weightMap = {
  regular: ScissorsRegular,
  bold: ScissorsBold,
  duotone: ScissorsDuotone,
  fill: ScissorsFill,
  light: ScissorsLight,
  thin: ScissorsThin,
} as const

export const Scissors = (props: IconProps) => {
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
