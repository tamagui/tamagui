import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AirplaneTakeoffBold } from '../bold/airplane-takeoff-bold'
import { AirplaneTakeoffDuotone } from '../duotone/airplane-takeoff-duotone'
import { AirplaneTakeoffFill } from '../fill/airplane-takeoff-fill'
import { AirplaneTakeoffLight } from '../light/airplane-takeoff-light'
import { AirplaneTakeoffRegular } from '../regular/airplane-takeoff-regular'
import { AirplaneTakeoffThin } from '../thin/airplane-takeoff-thin'

const weightMap = {
  regular: AirplaneTakeoffRegular,
  bold: AirplaneTakeoffBold,
  duotone: AirplaneTakeoffDuotone,
  fill: AirplaneTakeoffFill,
  light: AirplaneTakeoffLight,
  thin: AirplaneTakeoffThin,
} as const

export const AirplaneTakeoff = (props: IconProps) => {
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
