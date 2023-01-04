import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TrainBold } from '../bold/train-bold'
import { TrainDuotone } from '../duotone/train-duotone'
import { TrainFill } from '../fill/train-fill'
import { TrainLight } from '../light/train-light'
import { TrainRegular } from '../regular/train-regular'
import { TrainThin } from '../thin/train-thin'

const weightMap = {
  regular: TrainRegular,
  bold: TrainBold,
  duotone: TrainDuotone,
  fill: TrainFill,
  light: TrainLight,
  thin: TrainThin,
} as const

export const Train = (props: IconProps) => {
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
