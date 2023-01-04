import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SelectionAllBold } from '../bold/selection-all-bold'
import { SelectionAllDuotone } from '../duotone/selection-all-duotone'
import { SelectionAllFill } from '../fill/selection-all-fill'
import { SelectionAllLight } from '../light/selection-all-light'
import { SelectionAllRegular } from '../regular/selection-all-regular'
import { SelectionAllThin } from '../thin/selection-all-thin'

const weightMap = {
  regular: SelectionAllRegular,
  bold: SelectionAllBold,
  duotone: SelectionAllDuotone,
  fill: SelectionAllFill,
  light: SelectionAllLight,
  thin: SelectionAllThin,
} as const

export const SelectionAll = (props: IconProps) => {
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
