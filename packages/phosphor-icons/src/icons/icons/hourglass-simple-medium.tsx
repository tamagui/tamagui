import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HourglassSimpleMediumBold } from '../bold/hourglass-simple-medium-bold'
import { HourglassSimpleMediumDuotone } from '../duotone/hourglass-simple-medium-duotone'
import { HourglassSimpleMediumFill } from '../fill/hourglass-simple-medium-fill'
import { HourglassSimpleMediumLight } from '../light/hourglass-simple-medium-light'
import { HourglassSimpleMediumRegular } from '../regular/hourglass-simple-medium-regular'
import { HourglassSimpleMediumThin } from '../thin/hourglass-simple-medium-thin'

const weightMap = {
  regular: HourglassSimpleMediumRegular,
  bold: HourglassSimpleMediumBold,
  duotone: HourglassSimpleMediumDuotone,
  fill: HourglassSimpleMediumFill,
  light: HourglassSimpleMediumLight,
  thin: HourglassSimpleMediumThin,
} as const

export const HourglassSimpleMedium = (props: IconProps) => {
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
