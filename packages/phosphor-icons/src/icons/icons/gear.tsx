import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GearBold } from '../bold/gear-bold'
import { GearDuotone } from '../duotone/gear-duotone'
import { GearFill } from '../fill/gear-fill'
import { GearLight } from '../light/gear-light'
import { GearRegular } from '../regular/gear-regular'
import { GearThin } from '../thin/gear-thin'

const weightMap = {
  regular: GearRegular,
  bold: GearBold,
  duotone: GearDuotone,
  fill: GearFill,
  light: GearLight,
  thin: GearThin,
} as const

export const Gear = (props: IconProps) => {
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
