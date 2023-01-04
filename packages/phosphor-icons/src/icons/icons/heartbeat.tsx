import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HeartbeatBold } from '../bold/heartbeat-bold'
import { HeartbeatDuotone } from '../duotone/heartbeat-duotone'
import { HeartbeatFill } from '../fill/heartbeat-fill'
import { HeartbeatLight } from '../light/heartbeat-light'
import { HeartbeatRegular } from '../regular/heartbeat-regular'
import { HeartbeatThin } from '../thin/heartbeat-thin'

const weightMap = {
  regular: HeartbeatRegular,
  bold: HeartbeatBold,
  duotone: HeartbeatDuotone,
  fill: HeartbeatFill,
  light: HeartbeatLight,
  thin: HeartbeatThin,
} as const

export const Heartbeat = (props: IconProps) => {
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
