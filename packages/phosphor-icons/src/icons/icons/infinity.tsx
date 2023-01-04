import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { InfinityBold } from '../bold/infinity-bold'
import { InfinityDuotone } from '../duotone/infinity-duotone'
import { InfinityFill } from '../fill/infinity-fill'
import { InfinityLight } from '../light/infinity-light'
import { InfinityRegular } from '../regular/infinity-regular'
import { InfinityThin } from '../thin/infinity-thin'

const weightMap = {
  regular: InfinityRegular,
  bold: InfinityBold,
  duotone: InfinityDuotone,
  fill: InfinityFill,
  light: InfinityLight,
  thin: InfinityThin,
} as const

export const Infinity = (props: IconProps) => {
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
