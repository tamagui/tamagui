import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CalendarCheckBold } from '../bold/calendar-check-bold'
import { CalendarCheckDuotone } from '../duotone/calendar-check-duotone'
import { CalendarCheckFill } from '../fill/calendar-check-fill'
import { CalendarCheckLight } from '../light/calendar-check-light'
import { CalendarCheckRegular } from '../regular/calendar-check-regular'
import { CalendarCheckThin } from '../thin/calendar-check-thin'

const weightMap = {
  regular: CalendarCheckRegular,
  bold: CalendarCheckBold,
  duotone: CalendarCheckDuotone,
  fill: CalendarCheckFill,
  light: CalendarCheckLight,
  thin: CalendarCheckThin,
} as const

export const CalendarCheck = (props: IconProps) => {
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
