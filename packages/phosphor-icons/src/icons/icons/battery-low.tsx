import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BatteryLowBold } from '../bold/battery-low-bold'
import { BatteryLowDuotone } from '../duotone/battery-low-duotone'
import { BatteryLowFill } from '../fill/battery-low-fill'
import { BatteryLowLight } from '../light/battery-low-light'
import { BatteryLowRegular } from '../regular/battery-low-regular'
import { BatteryLowThin } from '../thin/battery-low-thin'

const weightMap = {
  regular: BatteryLowRegular,
  bold: BatteryLowBold,
  duotone: BatteryLowDuotone,
  fill: BatteryLowFill,
  light: BatteryLowLight,
  thin: BatteryLowThin,
} as const

export const BatteryLow = (props: IconProps) => {
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
