import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BatteryEmptyBold } from '../bold/battery-empty-bold'
import { BatteryEmptyDuotone } from '../duotone/battery-empty-duotone'
import { BatteryEmptyFill } from '../fill/battery-empty-fill'
import { BatteryEmptyLight } from '../light/battery-empty-light'
import { BatteryEmptyRegular } from '../regular/battery-empty-regular'
import { BatteryEmptyThin } from '../thin/battery-empty-thin'

const weightMap = {
  regular: BatteryEmptyRegular,
  bold: BatteryEmptyBold,
  duotone: BatteryEmptyDuotone,
  fill: BatteryEmptyFill,
  light: BatteryEmptyLight,
  thin: BatteryEmptyThin,
} as const

export const BatteryEmpty = (props: IconProps) => {
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
