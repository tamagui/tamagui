import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SelectionInverseBold } from '../bold/selection-inverse-bold'
import { SelectionInverseDuotone } from '../duotone/selection-inverse-duotone'
import { SelectionInverseFill } from '../fill/selection-inverse-fill'
import { SelectionInverseLight } from '../light/selection-inverse-light'
import { SelectionInverseRegular } from '../regular/selection-inverse-regular'
import { SelectionInverseThin } from '../thin/selection-inverse-thin'

const weightMap = {
  regular: SelectionInverseRegular,
  bold: SelectionInverseBold,
  duotone: SelectionInverseDuotone,
  fill: SelectionInverseFill,
  light: SelectionInverseLight,
  thin: SelectionInverseThin,
} as const

export const SelectionInverse = (props: IconProps) => {
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
