import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PenNibBold } from '../bold/pen-nib-bold'
import { PenNibDuotone } from '../duotone/pen-nib-duotone'
import { PenNibFill } from '../fill/pen-nib-fill'
import { PenNibLight } from '../light/pen-nib-light'
import { PenNibRegular } from '../regular/pen-nib-regular'
import { PenNibThin } from '../thin/pen-nib-thin'

const weightMap = {
  regular: PenNibRegular,
  bold: PenNibBold,
  duotone: PenNibDuotone,
  fill: PenNibFill,
  light: PenNibLight,
  thin: PenNibThin,
} as const

export const PenNib = (props: IconProps) => {
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
