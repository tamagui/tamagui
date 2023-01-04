import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BusBold } from '../bold/bus-bold'
import { BusDuotone } from '../duotone/bus-duotone'
import { BusFill } from '../fill/bus-fill'
import { BusLight } from '../light/bus-light'
import { BusRegular } from '../regular/bus-regular'
import { BusThin } from '../thin/bus-thin'

const weightMap = {
  regular: BusRegular,
  bold: BusBold,
  duotone: BusDuotone,
  fill: BusFill,
  light: BusLight,
  thin: BusThin,
} as const

export const Bus = (props: IconProps) => {
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
