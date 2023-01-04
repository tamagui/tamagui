import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { UsersBold } from '../bold/users-bold'
import { UsersDuotone } from '../duotone/users-duotone'
import { UsersFill } from '../fill/users-fill'
import { UsersLight } from '../light/users-light'
import { UsersRegular } from '../regular/users-regular'
import { UsersThin } from '../thin/users-thin'

const weightMap = {
  regular: UsersRegular,
  bold: UsersBold,
  duotone: UsersDuotone,
  fill: UsersFill,
  light: UsersLight,
  thin: UsersThin,
} as const

export const Users = (props: IconProps) => {
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
