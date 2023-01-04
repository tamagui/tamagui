import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SelectionPlusBold } from '../bold/selection-plus-bold'
import { SelectionPlusDuotone } from '../duotone/selection-plus-duotone'
import { SelectionPlusFill } from '../fill/selection-plus-fill'
import { SelectionPlusLight } from '../light/selection-plus-light'
import { SelectionPlusRegular } from '../regular/selection-plus-regular'
import { SelectionPlusThin } from '../thin/selection-plus-thin'

const weightMap = {
  regular: SelectionPlusRegular,
  bold: SelectionPlusBold,
  duotone: SelectionPlusDuotone,
  fill: SelectionPlusFill,
  light: SelectionPlusLight,
  thin: SelectionPlusThin,
} as const

export const SelectionPlus = (props: IconProps) => {
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
