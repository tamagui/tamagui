import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PauseBold } from '../bold/pause-bold'
import { PauseDuotone } from '../duotone/pause-duotone'
import { PauseFill } from '../fill/pause-fill'
import { PauseLight } from '../light/pause-light'
import { PauseRegular } from '../regular/pause-regular'
import { PauseThin } from '../thin/pause-thin'

const weightMap = {
  regular: PauseRegular,
  bold: PauseBold,
  duotone: PauseDuotone,
  fill: PauseFill,
  light: PauseLight,
  thin: PauseThin,
} as const

export const Pause = (props: IconProps) => {
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
