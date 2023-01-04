import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BatteryHighBold } from '../bold/battery-high-bold'
import { BatteryHighDuotone } from '../duotone/battery-high-duotone'
import { BatteryHighFill } from '../fill/battery-high-fill'
import { BatteryHighLight } from '../light/battery-high-light'
import { BatteryHighRegular } from '../regular/battery-high-regular'
import { BatteryHighThin } from '../thin/battery-high-thin'

const weightMap = {
  regular: BatteryHighRegular,
  bold: BatteryHighBold,
  duotone: BatteryHighDuotone,
  fill: BatteryHighFill,
  light: BatteryHighLight,
  thin: BatteryHighThin,
} as const

export const BatteryHigh = (props: IconProps) => {
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
