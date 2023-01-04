import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BatteryChargingVerticalBold } from '../bold/battery-charging-vertical-bold'
import { BatteryChargingVerticalDuotone } from '../duotone/battery-charging-vertical-duotone'
import { BatteryChargingVerticalFill } from '../fill/battery-charging-vertical-fill'
import { BatteryChargingVerticalLight } from '../light/battery-charging-vertical-light'
import { BatteryChargingVerticalRegular } from '../regular/battery-charging-vertical-regular'
import { BatteryChargingVerticalThin } from '../thin/battery-charging-vertical-thin'

const weightMap = {
  regular: BatteryChargingVerticalRegular,
  bold: BatteryChargingVerticalBold,
  duotone: BatteryChargingVerticalDuotone,
  fill: BatteryChargingVerticalFill,
  light: BatteryChargingVerticalLight,
  thin: BatteryChargingVerticalThin,
} as const

export const BatteryChargingVertical = (props: IconProps) => {
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
