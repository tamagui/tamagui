import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TrafficSignBold } from '../bold/traffic-sign-bold'
import { TrafficSignDuotone } from '../duotone/traffic-sign-duotone'
import { TrafficSignFill } from '../fill/traffic-sign-fill'
import { TrafficSignLight } from '../light/traffic-sign-light'
import { TrafficSignRegular } from '../regular/traffic-sign-regular'
import { TrafficSignThin } from '../thin/traffic-sign-thin'

const weightMap = {
  regular: TrafficSignRegular,
  bold: TrafficSignBold,
  duotone: TrafficSignDuotone,
  fill: TrafficSignFill,
  light: TrafficSignLight,
  thin: TrafficSignThin,
} as const

export const TrafficSign = (props: IconProps) => {
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
