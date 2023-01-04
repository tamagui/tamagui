import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BatteryFullBold } from '../bold/battery-full-bold'
import { BatteryFullDuotone } from '../duotone/battery-full-duotone'
import { BatteryFullFill } from '../fill/battery-full-fill'
import { BatteryFullLight } from '../light/battery-full-light'
import { BatteryFullRegular } from '../regular/battery-full-regular'
import { BatteryFullThin } from '../thin/battery-full-thin'

const weightMap = {
  regular: BatteryFullRegular,
  bold: BatteryFullBold,
  duotone: BatteryFullDuotone,
  fill: BatteryFullFill,
  light: BatteryFullLight,
  thin: BatteryFullThin,
} as const

export const BatteryFull = (props: IconProps) => {
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
