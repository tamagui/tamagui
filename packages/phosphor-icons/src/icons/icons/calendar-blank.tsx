import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CalendarBlankBold } from '../bold/calendar-blank-bold'
import { CalendarBlankDuotone } from '../duotone/calendar-blank-duotone'
import { CalendarBlankFill } from '../fill/calendar-blank-fill'
import { CalendarBlankLight } from '../light/calendar-blank-light'
import { CalendarBlankRegular } from '../regular/calendar-blank-regular'
import { CalendarBlankThin } from '../thin/calendar-blank-thin'

const weightMap = {
  regular: CalendarBlankRegular,
  bold: CalendarBlankBold,
  duotone: CalendarBlankDuotone,
  fill: CalendarBlankFill,
  light: CalendarBlankLight,
  thin: CalendarBlankThin,
} as const

export const CalendarBlank = (props: IconProps) => {
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
