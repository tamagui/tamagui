import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CalendarXBold } from '../bold/calendar-x-bold'
import { CalendarXDuotone } from '../duotone/calendar-x-duotone'
import { CalendarXFill } from '../fill/calendar-x-fill'
import { CalendarXLight } from '../light/calendar-x-light'
import { CalendarXRegular } from '../regular/calendar-x-regular'
import { CalendarXThin } from '../thin/calendar-x-thin'

const weightMap = {
  regular: CalendarXRegular,
  bold: CalendarXBold,
  duotone: CalendarXDuotone,
  fill: CalendarXFill,
  light: CalendarXLight,
  thin: CalendarXThin,
} as const

export const CalendarX = (props: IconProps) => {
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
