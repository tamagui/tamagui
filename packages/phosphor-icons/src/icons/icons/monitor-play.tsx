import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MonitorPlayBold } from '../bold/monitor-play-bold'
import { MonitorPlayDuotone } from '../duotone/monitor-play-duotone'
import { MonitorPlayFill } from '../fill/monitor-play-fill'
import { MonitorPlayLight } from '../light/monitor-play-light'
import { MonitorPlayRegular } from '../regular/monitor-play-regular'
import { MonitorPlayThin } from '../thin/monitor-play-thin'

const weightMap = {
  regular: MonitorPlayRegular,
  bold: MonitorPlayBold,
  duotone: MonitorPlayDuotone,
  fill: MonitorPlayFill,
  light: MonitorPlayLight,
  thin: MonitorPlayThin,
} as const

export const MonitorPlay = (props: IconProps) => {
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
