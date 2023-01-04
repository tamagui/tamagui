import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { KanbanBold } from '../bold/kanban-bold'
import { KanbanDuotone } from '../duotone/kanban-duotone'
import { KanbanFill } from '../fill/kanban-fill'
import { KanbanLight } from '../light/kanban-light'
import { KanbanRegular } from '../regular/kanban-regular'
import { KanbanThin } from '../thin/kanban-thin'

const weightMap = {
  regular: KanbanRegular,
  bold: KanbanBold,
  duotone: KanbanDuotone,
  fill: KanbanFill,
  light: KanbanLight,
  thin: KanbanThin,
} as const

export const Kanban = (props: IconProps) => {
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
