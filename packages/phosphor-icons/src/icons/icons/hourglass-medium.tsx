import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HourglassMediumBold } from '../bold/hourglass-medium-bold'
import { HourglassMediumDuotone } from '../duotone/hourglass-medium-duotone'
import { HourglassMediumFill } from '../fill/hourglass-medium-fill'
import { HourglassMediumLight } from '../light/hourglass-medium-light'
import { HourglassMediumRegular } from '../regular/hourglass-medium-regular'
import { HourglassMediumThin } from '../thin/hourglass-medium-thin'

const weightMap = {
  regular: HourglassMediumRegular,
  bold: HourglassMediumBold,
  duotone: HourglassMediumDuotone,
  fill: HourglassMediumFill,
  light: HourglassMediumLight,
  thin: HourglassMediumThin,
} as const

export const HourglassMedium = (props: IconProps) => {
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
