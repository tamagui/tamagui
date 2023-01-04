import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PlayCircleBold } from '../bold/play-circle-bold'
import { PlayCircleDuotone } from '../duotone/play-circle-duotone'
import { PlayCircleFill } from '../fill/play-circle-fill'
import { PlayCircleLight } from '../light/play-circle-light'
import { PlayCircleRegular } from '../regular/play-circle-regular'
import { PlayCircleThin } from '../thin/play-circle-thin'

const weightMap = {
  regular: PlayCircleRegular,
  bold: PlayCircleBold,
  duotone: PlayCircleDuotone,
  fill: PlayCircleFill,
  light: PlayCircleLight,
  thin: PlayCircleThin,
} as const

export const PlayCircle = (props: IconProps) => {
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
