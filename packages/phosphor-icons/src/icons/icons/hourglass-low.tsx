import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HourglassLowBold } from '../bold/hourglass-low-bold'
import { HourglassLowDuotone } from '../duotone/hourglass-low-duotone'
import { HourglassLowFill } from '../fill/hourglass-low-fill'
import { HourglassLowLight } from '../light/hourglass-low-light'
import { HourglassLowRegular } from '../regular/hourglass-low-regular'
import { HourglassLowThin } from '../thin/hourglass-low-thin'

const weightMap = {
  regular: HourglassLowRegular,
  bold: HourglassLowBold,
  duotone: HourglassLowDuotone,
  fill: HourglassLowFill,
  light: HourglassLowLight,
  thin: HourglassLowThin,
} as const

export const HourglassLow = (props: IconProps) => {
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
