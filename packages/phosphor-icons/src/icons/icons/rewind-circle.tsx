import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RewindCircleBold } from '../bold/rewind-circle-bold'
import { RewindCircleDuotone } from '../duotone/rewind-circle-duotone'
import { RewindCircleFill } from '../fill/rewind-circle-fill'
import { RewindCircleLight } from '../light/rewind-circle-light'
import { RewindCircleRegular } from '../regular/rewind-circle-regular'
import { RewindCircleThin } from '../thin/rewind-circle-thin'

const weightMap = {
  regular: RewindCircleRegular,
  bold: RewindCircleBold,
  duotone: RewindCircleDuotone,
  fill: RewindCircleFill,
  light: RewindCircleLight,
  thin: RewindCircleThin,
} as const

export const RewindCircle = (props: IconProps) => {
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
