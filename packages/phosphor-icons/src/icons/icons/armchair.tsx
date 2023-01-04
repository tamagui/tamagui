import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArmchairBold } from '../bold/armchair-bold'
import { ArmchairDuotone } from '../duotone/armchair-duotone'
import { ArmchairFill } from '../fill/armchair-fill'
import { ArmchairLight } from '../light/armchair-light'
import { ArmchairRegular } from '../regular/armchair-regular'
import { ArmchairThin } from '../thin/armchair-thin'

const weightMap = {
  regular: ArmchairRegular,
  bold: ArmchairBold,
  duotone: ArmchairDuotone,
  fill: ArmchairFill,
  light: ArmchairLight,
  thin: ArmchairThin,
} as const

export const Armchair = (props: IconProps) => {
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
