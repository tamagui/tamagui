import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NotificationBold } from '../bold/notification-bold'
import { NotificationDuotone } from '../duotone/notification-duotone'
import { NotificationFill } from '../fill/notification-fill'
import { NotificationLight } from '../light/notification-light'
import { NotificationRegular } from '../regular/notification-regular'
import { NotificationThin } from '../thin/notification-thin'

const weightMap = {
  regular: NotificationRegular,
  bold: NotificationBold,
  duotone: NotificationDuotone,
  fill: NotificationFill,
  light: NotificationLight,
  thin: NotificationThin,
} as const

export const Notification = (props: IconProps) => {
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
