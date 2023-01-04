import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TrainRegionalBold } from '../bold/train-regional-bold'
import { TrainRegionalDuotone } from '../duotone/train-regional-duotone'
import { TrainRegionalFill } from '../fill/train-regional-fill'
import { TrainRegionalLight } from '../light/train-regional-light'
import { TrainRegionalRegular } from '../regular/train-regional-regular'
import { TrainRegionalThin } from '../thin/train-regional-thin'

const weightMap = {
  regular: TrainRegionalRegular,
  bold: TrainRegionalBold,
  duotone: TrainRegionalDuotone,
  fill: TrainRegionalFill,
  light: TrainRegionalLight,
  thin: TrainRegionalThin,
} as const

export const TrainRegional = (props: IconProps) => {
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
