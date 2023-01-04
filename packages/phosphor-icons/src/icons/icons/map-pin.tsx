import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MapPinBold } from '../bold/map-pin-bold'
import { MapPinDuotone } from '../duotone/map-pin-duotone'
import { MapPinFill } from '../fill/map-pin-fill'
import { MapPinLight } from '../light/map-pin-light'
import { MapPinRegular } from '../regular/map-pin-regular'
import { MapPinThin } from '../thin/map-pin-thin'

const weightMap = {
  regular: MapPinRegular,
  bold: MapPinBold,
  duotone: MapPinDuotone,
  fill: MapPinFill,
  light: MapPinLight,
  thin: MapPinThin,
} as const

export const MapPin = (props: IconProps) => {
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
