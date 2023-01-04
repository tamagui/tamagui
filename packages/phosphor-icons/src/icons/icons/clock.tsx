import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ClockBold } from '../bold/clock-bold'
import { ClockDuotone } from '../duotone/clock-duotone'
import { ClockFill } from '../fill/clock-fill'
import { ClockLight } from '../light/clock-light'
import { ClockRegular } from '../regular/clock-regular'
import { ClockThin } from '../thin/clock-thin'

const weightMap = {
  regular: ClockRegular,
  bold: ClockBold,
  duotone: ClockDuotone,
  fill: ClockFill,
  light: ClockLight,
  thin: ClockThin,
} as const

export const Clock = (props: IconProps) => {
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
