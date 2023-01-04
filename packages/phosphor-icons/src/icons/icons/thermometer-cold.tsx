import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ThermometerColdBold } from '../bold/thermometer-cold-bold'
import { ThermometerColdDuotone } from '../duotone/thermometer-cold-duotone'
import { ThermometerColdFill } from '../fill/thermometer-cold-fill'
import { ThermometerColdLight } from '../light/thermometer-cold-light'
import { ThermometerColdRegular } from '../regular/thermometer-cold-regular'
import { ThermometerColdThin } from '../thin/thermometer-cold-thin'

const weightMap = {
  regular: ThermometerColdRegular,
  bold: ThermometerColdBold,
  duotone: ThermometerColdDuotone,
  fill: ThermometerColdFill,
  light: ThermometerColdLight,
  thin: ThermometerColdThin,
} as const

export const ThermometerCold = (props: IconProps) => {
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
