import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SortAscendingBold } from '../bold/sort-ascending-bold'
import { SortAscendingDuotone } from '../duotone/sort-ascending-duotone'
import { SortAscendingFill } from '../fill/sort-ascending-fill'
import { SortAscendingLight } from '../light/sort-ascending-light'
import { SortAscendingRegular } from '../regular/sort-ascending-regular'
import { SortAscendingThin } from '../thin/sort-ascending-thin'

const weightMap = {
  regular: SortAscendingRegular,
  bold: SortAscendingBold,
  duotone: SortAscendingDuotone,
  fill: SortAscendingFill,
  light: SortAscendingLight,
  thin: SortAscendingThin,
} as const

export const SortAscending = (props: IconProps) => {
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
