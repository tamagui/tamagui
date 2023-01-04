import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ClockAfternoonBold } from '../bold/clock-afternoon-bold'
import { ClockAfternoonDuotone } from '../duotone/clock-afternoon-duotone'
import { ClockAfternoonFill } from '../fill/clock-afternoon-fill'
import { ClockAfternoonLight } from '../light/clock-afternoon-light'
import { ClockAfternoonRegular } from '../regular/clock-afternoon-regular'
import { ClockAfternoonThin } from '../thin/clock-afternoon-thin'

const weightMap = {
  regular: ClockAfternoonRegular,
  bold: ClockAfternoonBold,
  duotone: ClockAfternoonDuotone,
  fill: ClockAfternoonFill,
  light: ClockAfternoonLight,
  thin: ClockAfternoonThin,
} as const

export const ClockAfternoon = (props: IconProps) => {
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
