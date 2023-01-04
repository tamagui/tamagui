import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { UserCirclePlusBold } from '../bold/user-circle-plus-bold'
import { UserCirclePlusDuotone } from '../duotone/user-circle-plus-duotone'
import { UserCirclePlusFill } from '../fill/user-circle-plus-fill'
import { UserCirclePlusLight } from '../light/user-circle-plus-light'
import { UserCirclePlusRegular } from '../regular/user-circle-plus-regular'
import { UserCirclePlusThin } from '../thin/user-circle-plus-thin'

const weightMap = {
  regular: UserCirclePlusRegular,
  bold: UserCirclePlusBold,
  duotone: UserCirclePlusDuotone,
  fill: UserCirclePlusFill,
  light: UserCirclePlusLight,
  thin: UserCirclePlusThin,
} as const

export const UserCirclePlus = (props: IconProps) => {
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
