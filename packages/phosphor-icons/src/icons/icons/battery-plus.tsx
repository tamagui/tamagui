import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BatteryPlusBold } from '../bold/battery-plus-bold'
import { BatteryPlusDuotone } from '../duotone/battery-plus-duotone'
import { BatteryPlusFill } from '../fill/battery-plus-fill'
import { BatteryPlusLight } from '../light/battery-plus-light'
import { BatteryPlusRegular } from '../regular/battery-plus-regular'
import { BatteryPlusThin } from '../thin/battery-plus-thin'

const weightMap = {
  regular: BatteryPlusRegular,
  bold: BatteryPlusBold,
  duotone: BatteryPlusDuotone,
  fill: BatteryPlusFill,
  light: BatteryPlusLight,
  thin: BatteryPlusThin,
} as const

export const BatteryPlus = (props: IconProps) => {
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
