import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MarkerCircleBold } from '../bold/marker-circle-bold'
import { MarkerCircleDuotone } from '../duotone/marker-circle-duotone'
import { MarkerCircleFill } from '../fill/marker-circle-fill'
import { MarkerCircleLight } from '../light/marker-circle-light'
import { MarkerCircleRegular } from '../regular/marker-circle-regular'
import { MarkerCircleThin } from '../thin/marker-circle-thin'

const weightMap = {
  regular: MarkerCircleRegular,
  bold: MarkerCircleBold,
  duotone: MarkerCircleDuotone,
  fill: MarkerCircleFill,
  light: MarkerCircleLight,
  thin: MarkerCircleThin,
} as const

export const MarkerCircle = (props: IconProps) => {
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
