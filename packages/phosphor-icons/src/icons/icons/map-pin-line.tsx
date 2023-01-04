import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MapPinLineBold } from '../bold/map-pin-line-bold'
import { MapPinLineDuotone } from '../duotone/map-pin-line-duotone'
import { MapPinLineFill } from '../fill/map-pin-line-fill'
import { MapPinLineLight } from '../light/map-pin-line-light'
import { MapPinLineRegular } from '../regular/map-pin-line-regular'
import { MapPinLineThin } from '../thin/map-pin-line-thin'

const weightMap = {
  regular: MapPinLineRegular,
  bold: MapPinLineBold,
  duotone: MapPinLineDuotone,
  fill: MapPinLineFill,
  light: MapPinLineLight,
  thin: MapPinLineThin,
} as const

export const MapPinLine = (props: IconProps) => {
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
