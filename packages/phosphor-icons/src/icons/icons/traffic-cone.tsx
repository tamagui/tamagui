import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TrafficConeBold } from '../bold/traffic-cone-bold'
import { TrafficConeDuotone } from '../duotone/traffic-cone-duotone'
import { TrafficConeFill } from '../fill/traffic-cone-fill'
import { TrafficConeLight } from '../light/traffic-cone-light'
import { TrafficConeRegular } from '../regular/traffic-cone-regular'
import { TrafficConeThin } from '../thin/traffic-cone-thin'

const weightMap = {
  regular: TrafficConeRegular,
  bold: TrafficConeBold,
  duotone: TrafficConeDuotone,
  fill: TrafficConeFill,
  light: TrafficConeLight,
  thin: TrafficConeThin,
} as const

export const TrafficCone = (props: IconProps) => {
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
