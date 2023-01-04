import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BatteryChargingBold } from '../bold/battery-charging-bold'
import { BatteryChargingDuotone } from '../duotone/battery-charging-duotone'
import { BatteryChargingFill } from '../fill/battery-charging-fill'
import { BatteryChargingLight } from '../light/battery-charging-light'
import { BatteryChargingRegular } from '../regular/battery-charging-regular'
import { BatteryChargingThin } from '../thin/battery-charging-thin'

const weightMap = {
  regular: BatteryChargingRegular,
  bold: BatteryChargingBold,
  duotone: BatteryChargingDuotone,
  fill: BatteryChargingFill,
  light: BatteryChargingLight,
  thin: BatteryChargingThin,
} as const

export const BatteryCharging = (props: IconProps) => {
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
