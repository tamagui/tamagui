import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GaugeBold } from '../bold/gauge-bold'
import { GaugeDuotone } from '../duotone/gauge-duotone'
import { GaugeFill } from '../fill/gauge-fill'
import { GaugeLight } from '../light/gauge-light'
import { GaugeRegular } from '../regular/gauge-regular'
import { GaugeThin } from '../thin/gauge-thin'

const weightMap = {
  regular: GaugeRegular,
  bold: GaugeBold,
  duotone: GaugeDuotone,
  fill: GaugeFill,
  light: GaugeLight,
  thin: GaugeThin,
} as const

export const Gauge = (props: IconProps) => {
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
