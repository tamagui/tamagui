import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CircleBold } from '../bold/circle-bold'
import { CircleDuotone } from '../duotone/circle-duotone'
import { CircleFill } from '../fill/circle-fill'
import { CircleLight } from '../light/circle-light'
import { CircleRegular } from '../regular/circle-regular'
import { CircleThin } from '../thin/circle-thin'

const weightMap = {
  regular: CircleRegular,
  bold: CircleBold,
  duotone: CircleDuotone,
  fill: CircleFill,
  light: CircleLight,
  thin: CircleThin,
} as const

export const Circle = (props: IconProps) => {
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
