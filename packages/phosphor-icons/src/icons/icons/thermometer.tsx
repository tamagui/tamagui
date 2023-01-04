import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ThermometerBold } from '../bold/thermometer-bold'
import { ThermometerDuotone } from '../duotone/thermometer-duotone'
import { ThermometerFill } from '../fill/thermometer-fill'
import { ThermometerLight } from '../light/thermometer-light'
import { ThermometerRegular } from '../regular/thermometer-regular'
import { ThermometerThin } from '../thin/thermometer-thin'

const weightMap = {
  regular: ThermometerRegular,
  bold: ThermometerBold,
  duotone: ThermometerDuotone,
  fill: ThermometerFill,
  light: ThermometerLight,
  thin: ThermometerThin,
} as const

export const Thermometer = (props: IconProps) => {
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
