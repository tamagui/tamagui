import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HourglassBold } from '../bold/hourglass-bold'
import { HourglassDuotone } from '../duotone/hourglass-duotone'
import { HourglassFill } from '../fill/hourglass-fill'
import { HourglassLight } from '../light/hourglass-light'
import { HourglassRegular } from '../regular/hourglass-regular'
import { HourglassThin } from '../thin/hourglass-thin'

const weightMap = {
  regular: HourglassRegular,
  bold: HourglassBold,
  duotone: HourglassDuotone,
  fill: HourglassFill,
  light: HourglassLight,
  thin: HourglassThin,
} as const

export const Hourglass = (props: IconProps) => {
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
