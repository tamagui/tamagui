import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PenNibStraightBold } from '../bold/pen-nib-straight-bold'
import { PenNibStraightDuotone } from '../duotone/pen-nib-straight-duotone'
import { PenNibStraightFill } from '../fill/pen-nib-straight-fill'
import { PenNibStraightLight } from '../light/pen-nib-straight-light'
import { PenNibStraightRegular } from '../regular/pen-nib-straight-regular'
import { PenNibStraightThin } from '../thin/pen-nib-straight-thin'

const weightMap = {
  regular: PenNibStraightRegular,
  bold: PenNibStraightBold,
  duotone: PenNibStraightDuotone,
  fill: PenNibStraightFill,
  light: PenNibStraightLight,
  thin: PenNibStraightThin,
} as const

export const PenNibStraight = (props: IconProps) => {
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
