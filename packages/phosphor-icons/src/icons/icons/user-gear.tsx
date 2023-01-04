import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { UserGearBold } from '../bold/user-gear-bold'
import { UserGearDuotone } from '../duotone/user-gear-duotone'
import { UserGearFill } from '../fill/user-gear-fill'
import { UserGearLight } from '../light/user-gear-light'
import { UserGearRegular } from '../regular/user-gear-regular'
import { UserGearThin } from '../thin/user-gear-thin'

const weightMap = {
  regular: UserGearRegular,
  bold: UserGearBold,
  duotone: UserGearDuotone,
  fill: UserGearFill,
  light: UserGearLight,
  thin: UserGearThin,
} as const

export const UserGear = (props: IconProps) => {
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
