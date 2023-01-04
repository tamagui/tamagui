import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TreeEvergreenBold } from '../bold/tree-evergreen-bold'
import { TreeEvergreenDuotone } from '../duotone/tree-evergreen-duotone'
import { TreeEvergreenFill } from '../fill/tree-evergreen-fill'
import { TreeEvergreenLight } from '../light/tree-evergreen-light'
import { TreeEvergreenRegular } from '../regular/tree-evergreen-regular'
import { TreeEvergreenThin } from '../thin/tree-evergreen-thin'

const weightMap = {
  regular: TreeEvergreenRegular,
  bold: TreeEvergreenBold,
  duotone: TreeEvergreenDuotone,
  fill: TreeEvergreenFill,
  light: TreeEvergreenLight,
  thin: TreeEvergreenThin,
} as const

export const TreeEvergreen = (props: IconProps) => {
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
