import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PencilCircleBold } from '../bold/pencil-circle-bold'
import { PencilCircleDuotone } from '../duotone/pencil-circle-duotone'
import { PencilCircleFill } from '../fill/pencil-circle-fill'
import { PencilCircleLight } from '../light/pencil-circle-light'
import { PencilCircleRegular } from '../regular/pencil-circle-regular'
import { PencilCircleThin } from '../thin/pencil-circle-thin'

const weightMap = {
  regular: PencilCircleRegular,
  bold: PencilCircleBold,
  duotone: PencilCircleDuotone,
  fill: PencilCircleFill,
  light: PencilCircleLight,
  thin: PencilCircleThin,
} as const

export const PencilCircle = (props: IconProps) => {
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
