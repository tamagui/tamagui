import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SortDescendingBold } from '../bold/sort-descending-bold'
import { SortDescendingDuotone } from '../duotone/sort-descending-duotone'
import { SortDescendingFill } from '../fill/sort-descending-fill'
import { SortDescendingLight } from '../light/sort-descending-light'
import { SortDescendingRegular } from '../regular/sort-descending-regular'
import { SortDescendingThin } from '../thin/sort-descending-thin'

const weightMap = {
  regular: SortDescendingRegular,
  bold: SortDescendingBold,
  duotone: SortDescendingDuotone,
  fill: SortDescendingFill,
  light: SortDescendingLight,
  thin: SortDescendingThin,
} as const

export const SortDescending = (props: IconProps) => {
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
