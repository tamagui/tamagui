import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ThermometerHotBold } from '../bold/thermometer-hot-bold'
import { ThermometerHotDuotone } from '../duotone/thermometer-hot-duotone'
import { ThermometerHotFill } from '../fill/thermometer-hot-fill'
import { ThermometerHotLight } from '../light/thermometer-hot-light'
import { ThermometerHotRegular } from '../regular/thermometer-hot-regular'
import { ThermometerHotThin } from '../thin/thermometer-hot-thin'

const weightMap = {
  regular: ThermometerHotRegular,
  bold: ThermometerHotBold,
  duotone: ThermometerHotDuotone,
  fill: ThermometerHotFill,
  light: ThermometerHotLight,
  thin: ThermometerHotThin,
} as const

export const ThermometerHot = (props: IconProps) => {
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
