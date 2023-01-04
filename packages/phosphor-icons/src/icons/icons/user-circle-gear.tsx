import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { UserCircleGearBold } from '../bold/user-circle-gear-bold'
import { UserCircleGearDuotone } from '../duotone/user-circle-gear-duotone'
import { UserCircleGearFill } from '../fill/user-circle-gear-fill'
import { UserCircleGearLight } from '../light/user-circle-gear-light'
import { UserCircleGearRegular } from '../regular/user-circle-gear-regular'
import { UserCircleGearThin } from '../thin/user-circle-gear-thin'

const weightMap = {
  regular: UserCircleGearRegular,
  bold: UserCircleGearBold,
  duotone: UserCircleGearDuotone,
  fill: UserCircleGearFill,
  light: UserCircleGearLight,
  thin: UserCircleGearThin,
} as const

export const UserCircleGear = (props: IconProps) => {
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
