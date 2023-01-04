import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { UserBold } from '../bold/user-bold'
import { UserDuotone } from '../duotone/user-duotone'
import { UserFill } from '../fill/user-fill'
import { UserLight } from '../light/user-light'
import { UserRegular } from '../regular/user-regular'
import { UserThin } from '../thin/user-thin'

const weightMap = {
  regular: UserRegular,
  bold: UserBold,
  duotone: UserDuotone,
  fill: UserFill,
  light: UserLight,
  thin: UserThin,
} as const

export const User = (props: IconProps) => {
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
