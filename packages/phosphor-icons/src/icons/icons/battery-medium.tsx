import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BatteryMediumBold } from '../bold/battery-medium-bold'
import { BatteryMediumDuotone } from '../duotone/battery-medium-duotone'
import { BatteryMediumFill } from '../fill/battery-medium-fill'
import { BatteryMediumLight } from '../light/battery-medium-light'
import { BatteryMediumRegular } from '../regular/battery-medium-regular'
import { BatteryMediumThin } from '../thin/battery-medium-thin'

const weightMap = {
  regular: BatteryMediumRegular,
  bold: BatteryMediumBold,
  duotone: BatteryMediumDuotone,
  fill: BatteryMediumFill,
  light: BatteryMediumLight,
  thin: BatteryMediumThin,
} as const

export const BatteryMedium = (props: IconProps) => {
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
