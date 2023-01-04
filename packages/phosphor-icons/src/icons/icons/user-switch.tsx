import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { UserSwitchBold } from '../bold/user-switch-bold'
import { UserSwitchDuotone } from '../duotone/user-switch-duotone'
import { UserSwitchFill } from '../fill/user-switch-fill'
import { UserSwitchLight } from '../light/user-switch-light'
import { UserSwitchRegular } from '../regular/user-switch-regular'
import { UserSwitchThin } from '../thin/user-switch-thin'

const weightMap = {
  regular: UserSwitchRegular,
  bold: UserSwitchBold,
  duotone: UserSwitchDuotone,
  fill: UserSwitchFill,
  light: UserSwitchLight,
  thin: UserSwitchThin,
} as const

export const UserSwitch = (props: IconProps) => {
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
