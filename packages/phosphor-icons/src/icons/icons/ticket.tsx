import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TicketBold } from '../bold/ticket-bold'
import { TicketDuotone } from '../duotone/ticket-duotone'
import { TicketFill } from '../fill/ticket-fill'
import { TicketLight } from '../light/ticket-light'
import { TicketRegular } from '../regular/ticket-regular'
import { TicketThin } from '../thin/ticket-thin'

const weightMap = {
  regular: TicketRegular,
  bold: TicketBold,
  duotone: TicketDuotone,
  fill: TicketFill,
  light: TicketLight,
  thin: TicketThin,
} as const

export const Ticket = (props: IconProps) => {
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
