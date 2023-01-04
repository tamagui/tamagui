import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TruckBold } from '../bold/truck-bold'
import { TruckDuotone } from '../duotone/truck-duotone'
import { TruckFill } from '../fill/truck-fill'
import { TruckLight } from '../light/truck-light'
import { TruckRegular } from '../regular/truck-regular'
import { TruckThin } from '../thin/truck-thin'

const weightMap = {
  regular: TruckRegular,
  bold: TruckBold,
  duotone: TruckDuotone,
  fill: TruckFill,
  light: TruckLight,
  thin: TruckThin,
} as const

export const Truck = (props: IconProps) => {
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
