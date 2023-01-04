import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LeafBold } from '../bold/leaf-bold'
import { LeafDuotone } from '../duotone/leaf-duotone'
import { LeafFill } from '../fill/leaf-fill'
import { LeafLight } from '../light/leaf-light'
import { LeafRegular } from '../regular/leaf-regular'
import { LeafThin } from '../thin/leaf-thin'

const weightMap = {
  regular: LeafRegular,
  bold: LeafBold,
  duotone: LeafDuotone,
  fill: LeafFill,
  light: LeafLight,
  thin: LeafThin,
} as const

export const Leaf = (props: IconProps) => {
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
