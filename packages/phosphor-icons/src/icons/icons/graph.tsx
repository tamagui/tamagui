import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GraphBold } from '../bold/graph-bold'
import { GraphDuotone } from '../duotone/graph-duotone'
import { GraphFill } from '../fill/graph-fill'
import { GraphLight } from '../light/graph-light'
import { GraphRegular } from '../regular/graph-regular'
import { GraphThin } from '../thin/graph-thin'

const weightMap = {
  regular: GraphRegular,
  bold: GraphBold,
  duotone: GraphDuotone,
  fill: GraphFill,
  light: GraphLight,
  thin: GraphThin,
} as const

export const Graph = (props: IconProps) => {
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
