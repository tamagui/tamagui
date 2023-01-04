import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { UserFocusBold } from '../bold/user-focus-bold'
import { UserFocusDuotone } from '../duotone/user-focus-duotone'
import { UserFocusFill } from '../fill/user-focus-fill'
import { UserFocusLight } from '../light/user-focus-light'
import { UserFocusRegular } from '../regular/user-focus-regular'
import { UserFocusThin } from '../thin/user-focus-thin'

const weightMap = {
  regular: UserFocusRegular,
  bold: UserFocusBold,
  duotone: UserFocusDuotone,
  fill: UserFocusFill,
  light: UserFocusLight,
  thin: UserFocusThin,
} as const

export const UserFocus = (props: IconProps) => {
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
