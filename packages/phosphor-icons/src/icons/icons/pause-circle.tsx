import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PauseCircleBold } from '../bold/pause-circle-bold'
import { PauseCircleDuotone } from '../duotone/pause-circle-duotone'
import { PauseCircleFill } from '../fill/pause-circle-fill'
import { PauseCircleLight } from '../light/pause-circle-light'
import { PauseCircleRegular } from '../regular/pause-circle-regular'
import { PauseCircleThin } from '../thin/pause-circle-thin'

const weightMap = {
  regular: PauseCircleRegular,
  bold: PauseCircleBold,
  duotone: PauseCircleDuotone,
  fill: PauseCircleFill,
  light: PauseCircleLight,
  thin: PauseCircleThin,
} as const

export const PauseCircle = (props: IconProps) => {
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
