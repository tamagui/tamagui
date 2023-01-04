import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { UserPlusBold } from '../bold/user-plus-bold'
import { UserPlusDuotone } from '../duotone/user-plus-duotone'
import { UserPlusFill } from '../fill/user-plus-fill'
import { UserPlusLight } from '../light/user-plus-light'
import { UserPlusRegular } from '../regular/user-plus-regular'
import { UserPlusThin } from '../thin/user-plus-thin'

const weightMap = {
  regular: UserPlusRegular,
  bold: UserPlusBold,
  duotone: UserPlusDuotone,
  fill: UserPlusFill,
  light: UserPlusLight,
  thin: UserPlusThin,
} as const

export const UserPlus = (props: IconProps) => {
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
