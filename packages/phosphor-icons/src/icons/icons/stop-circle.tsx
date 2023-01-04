import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { StopCircleBold } from '../bold/stop-circle-bold'
import { StopCircleDuotone } from '../duotone/stop-circle-duotone'
import { StopCircleFill } from '../fill/stop-circle-fill'
import { StopCircleLight } from '../light/stop-circle-light'
import { StopCircleRegular } from '../regular/stop-circle-regular'
import { StopCircleThin } from '../thin/stop-circle-thin'

const weightMap = {
  regular: StopCircleRegular,
  bold: StopCircleBold,
  duotone: StopCircleDuotone,
  fill: StopCircleFill,
  light: StopCircleLight,
  thin: StopCircleThin,
} as const

export const StopCircle = (props: IconProps) => {
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
