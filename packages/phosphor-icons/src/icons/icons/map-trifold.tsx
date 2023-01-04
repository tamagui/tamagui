import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MapTrifoldBold } from '../bold/map-trifold-bold'
import { MapTrifoldDuotone } from '../duotone/map-trifold-duotone'
import { MapTrifoldFill } from '../fill/map-trifold-fill'
import { MapTrifoldLight } from '../light/map-trifold-light'
import { MapTrifoldRegular } from '../regular/map-trifold-regular'
import { MapTrifoldThin } from '../thin/map-trifold-thin'

const weightMap = {
  regular: MapTrifoldRegular,
  bold: MapTrifoldBold,
  duotone: MapTrifoldDuotone,
  fill: MapTrifoldFill,
  light: MapTrifoldLight,
  thin: MapTrifoldThin,
} as const

export const MapTrifold = (props: IconProps) => {
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
