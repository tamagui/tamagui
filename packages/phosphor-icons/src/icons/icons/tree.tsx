import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TreeBold } from '../bold/tree-bold'
import { TreeDuotone } from '../duotone/tree-duotone'
import { TreeFill } from '../fill/tree-fill'
import { TreeLight } from '../light/tree-light'
import { TreeRegular } from '../regular/tree-regular'
import { TreeThin } from '../thin/tree-thin'

const weightMap = {
  regular: TreeRegular,
  bold: TreeBold,
  duotone: TreeDuotone,
  fill: TreeFill,
  light: TreeLight,
  thin: TreeThin,
} as const

export const Tree = (props: IconProps) => {
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
