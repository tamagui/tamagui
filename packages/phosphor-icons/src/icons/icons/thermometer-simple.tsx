import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ThermometerSimpleBold } from '../bold/thermometer-simple-bold'
import { ThermometerSimpleDuotone } from '../duotone/thermometer-simple-duotone'
import { ThermometerSimpleFill } from '../fill/thermometer-simple-fill'
import { ThermometerSimpleLight } from '../light/thermometer-simple-light'
import { ThermometerSimpleRegular } from '../regular/thermometer-simple-regular'
import { ThermometerSimpleThin } from '../thin/thermometer-simple-thin'

const weightMap = {
  regular: ThermometerSimpleRegular,
  bold: ThermometerSimpleBold,
  duotone: ThermometerSimpleDuotone,
  fill: ThermometerSimpleFill,
  light: ThermometerSimpleLight,
  thin: ThermometerSimpleThin,
} as const

export const ThermometerSimple = (props: IconProps) => {
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
