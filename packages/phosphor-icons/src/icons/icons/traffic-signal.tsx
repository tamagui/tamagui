import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TrafficSignalBold } from '../bold/traffic-signal-bold'
import { TrafficSignalDuotone } from '../duotone/traffic-signal-duotone'
import { TrafficSignalFill } from '../fill/traffic-signal-fill'
import { TrafficSignalLight } from '../light/traffic-signal-light'
import { TrafficSignalRegular } from '../regular/traffic-signal-regular'
import { TrafficSignalThin } from '../thin/traffic-signal-thin'

const weightMap = {
  regular: TrafficSignalRegular,
  bold: TrafficSignalBold,
  duotone: TrafficSignalDuotone,
  fill: TrafficSignalFill,
  light: TrafficSignalLight,
  thin: TrafficSignalThin,
} as const

export const TrafficSignal = (props: IconProps) => {
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
