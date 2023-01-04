import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BatteryWarningVerticalBold } from '../bold/battery-warning-vertical-bold'
import { BatteryWarningVerticalDuotone } from '../duotone/battery-warning-vertical-duotone'
import { BatteryWarningVerticalFill } from '../fill/battery-warning-vertical-fill'
import { BatteryWarningVerticalLight } from '../light/battery-warning-vertical-light'
import { BatteryWarningVerticalRegular } from '../regular/battery-warning-vertical-regular'
import { BatteryWarningVerticalThin } from '../thin/battery-warning-vertical-thin'

const weightMap = {
  regular: BatteryWarningVerticalRegular,
  bold: BatteryWarningVerticalBold,
  duotone: BatteryWarningVerticalDuotone,
  fill: BatteryWarningVerticalFill,
  light: BatteryWarningVerticalLight,
  thin: BatteryWarningVerticalThin,
} as const

export const BatteryWarningVertical = (props: IconProps) => {
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
