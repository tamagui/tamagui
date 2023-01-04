import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SelectionBold } from '../bold/selection-bold'
import { SelectionDuotone } from '../duotone/selection-duotone'
import { SelectionFill } from '../fill/selection-fill'
import { SelectionLight } from '../light/selection-light'
import { SelectionRegular } from '../regular/selection-regular'
import { SelectionThin } from '../thin/selection-thin'

const weightMap = {
  regular: SelectionRegular,
  bold: SelectionBold,
  duotone: SelectionDuotone,
  fill: SelectionFill,
  light: SelectionLight,
  thin: SelectionThin,
} as const

export const Selection = (props: IconProps) => {
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
