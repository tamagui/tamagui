import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TimerBold } from '../bold/timer-bold'
import { TimerDuotone } from '../duotone/timer-duotone'
import { TimerFill } from '../fill/timer-fill'
import { TimerLight } from '../light/timer-light'
import { TimerRegular } from '../regular/timer-regular'
import { TimerThin } from '../thin/timer-thin'

const weightMap = {
  regular: TimerRegular,
  bold: TimerBold,
  duotone: TimerDuotone,
  fill: TimerFill,
  light: TimerLight,
  thin: TimerThin,
} as const

export const Timer = (props: IconProps) => {
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
