import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CalendarPlusBold } from '../bold/calendar-plus-bold'
import { CalendarPlusDuotone } from '../duotone/calendar-plus-duotone'
import { CalendarPlusFill } from '../fill/calendar-plus-fill'
import { CalendarPlusLight } from '../light/calendar-plus-light'
import { CalendarPlusRegular } from '../regular/calendar-plus-regular'
import { CalendarPlusThin } from '../thin/calendar-plus-thin'

const weightMap = {
  regular: CalendarPlusRegular,
  bold: CalendarPlusBold,
  duotone: CalendarPlusDuotone,
  fill: CalendarPlusFill,
  light: CalendarPlusLight,
  thin: CalendarPlusThin,
} as const

export const CalendarPlus = (props: IconProps) => {
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
