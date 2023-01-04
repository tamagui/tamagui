import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { UserListBold } from '../bold/user-list-bold'
import { UserListDuotone } from '../duotone/user-list-duotone'
import { UserListFill } from '../fill/user-list-fill'
import { UserListLight } from '../light/user-list-light'
import { UserListRegular } from '../regular/user-list-regular'
import { UserListThin } from '../thin/user-list-thin'

const weightMap = {
  regular: UserListRegular,
  bold: UserListBold,
  duotone: UserListDuotone,
  fill: UserListFill,
  light: UserListLight,
  thin: UserListThin,
} as const

export const UserList = (props: IconProps) => {
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
