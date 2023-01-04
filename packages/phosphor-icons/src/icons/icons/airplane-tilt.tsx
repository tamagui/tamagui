import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AirplaneTiltBold } from '../bold/airplane-tilt-bold'
import { AirplaneTiltDuotone } from '../duotone/airplane-tilt-duotone'
import { AirplaneTiltFill } from '../fill/airplane-tilt-fill'
import { AirplaneTiltLight } from '../light/airplane-tilt-light'
import { AirplaneTiltRegular } from '../regular/airplane-tilt-regular'
import { AirplaneTiltThin } from '../thin/airplane-tilt-thin'

const weightMap = {
  regular: AirplaneTiltRegular,
  bold: AirplaneTiltBold,
  duotone: AirplaneTiltDuotone,
  fill: AirplaneTiltFill,
  light: AirplaneTiltLight,
  thin: AirplaneTiltThin,
} as const

export const AirplaneTilt = (props: IconProps) => {
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
