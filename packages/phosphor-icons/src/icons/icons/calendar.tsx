import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CalendarBold } from '../bold/calendar-bold'
import { CalendarDuotone } from '../duotone/calendar-duotone'
import { CalendarFill } from '../fill/calendar-fill'
import { CalendarLight } from '../light/calendar-light'
import { CalendarRegular } from '../regular/calendar-regular'
import { CalendarThin } from '../thin/calendar-thin'

const weightMap = {
  regular: CalendarRegular,
  bold: CalendarBold,
  duotone: CalendarDuotone,
  fill: CalendarFill,
  light: CalendarLight,
  thin: CalendarThin,
} as const

export const Calendar = (props: IconProps) => {
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
