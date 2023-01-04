import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TrainSimpleBold } from '../bold/train-simple-bold'
import { TrainSimpleDuotone } from '../duotone/train-simple-duotone'
import { TrainSimpleFill } from '../fill/train-simple-fill'
import { TrainSimpleLight } from '../light/train-simple-light'
import { TrainSimpleRegular } from '../regular/train-simple-regular'
import { TrainSimpleThin } from '../thin/train-simple-thin'

const weightMap = {
  regular: TrainSimpleRegular,
  bold: TrainSimpleBold,
  duotone: TrainSimpleDuotone,
  fill: TrainSimpleFill,
  light: TrainSimpleLight,
  thin: TrainSimpleThin,
} as const

export const TrainSimple = (props: IconProps) => {
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
