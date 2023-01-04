import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AirplaneInFlightBold } from '../bold/airplane-in-flight-bold'
import { AirplaneInFlightDuotone } from '../duotone/airplane-in-flight-duotone'
import { AirplaneInFlightFill } from '../fill/airplane-in-flight-fill'
import { AirplaneInFlightLight } from '../light/airplane-in-flight-light'
import { AirplaneInFlightRegular } from '../regular/airplane-in-flight-regular'
import { AirplaneInFlightThin } from '../thin/airplane-in-flight-thin'

const weightMap = {
  regular: AirplaneInFlightRegular,
  bold: AirplaneInFlightBold,
  duotone: AirplaneInFlightDuotone,
  fill: AirplaneInFlightFill,
  light: AirplaneInFlightLight,
  thin: AirplaneInFlightThin,
} as const

export const AirplaneInFlight = (props: IconProps) => {
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
