import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BatteryWarningBold } from '../bold/battery-warning-bold'
import { BatteryWarningDuotone } from '../duotone/battery-warning-duotone'
import { BatteryWarningFill } from '../fill/battery-warning-fill'
import { BatteryWarningLight } from '../light/battery-warning-light'
import { BatteryWarningRegular } from '../regular/battery-warning-regular'
import { BatteryWarningThin } from '../thin/battery-warning-thin'

const weightMap = {
  regular: BatteryWarningRegular,
  bold: BatteryWarningBold,
  duotone: BatteryWarningDuotone,
  fill: BatteryWarningFill,
  light: BatteryWarningLight,
  thin: BatteryWarningThin,
} as const

export const BatteryWarning = (props: IconProps) => {
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
