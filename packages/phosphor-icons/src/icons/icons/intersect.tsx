import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { IntersectBold } from '../bold/intersect-bold'
import { IntersectDuotone } from '../duotone/intersect-duotone'
import { IntersectFill } from '../fill/intersect-fill'
import { IntersectLight } from '../light/intersect-light'
import { IntersectRegular } from '../regular/intersect-regular'
import { IntersectThin } from '../thin/intersect-thin'

const weightMap = {
  regular: IntersectRegular,
  bold: IntersectBold,
  duotone: IntersectDuotone,
  fill: IntersectFill,
  light: IntersectLight,
  thin: IntersectThin,
} as const

export const Intersect = (props: IconProps) => {
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
