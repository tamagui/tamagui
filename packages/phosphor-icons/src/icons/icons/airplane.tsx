import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AirplaneBold } from '../bold/airplane-bold'
import { AirplaneDuotone } from '../duotone/airplane-duotone'
import { AirplaneFill } from '../fill/airplane-fill'
import { AirplaneLight } from '../light/airplane-light'
import { AirplaneRegular } from '../regular/airplane-regular'
import { AirplaneThin } from '../thin/airplane-thin'

const weightMap = {
  regular: AirplaneRegular,
  bold: AirplaneBold,
  duotone: AirplaneDuotone,
  fill: AirplaneFill,
  light: AirplaneLight,
  thin: AirplaneThin,
} as const

export const Airplane = (props: IconProps) => {
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
