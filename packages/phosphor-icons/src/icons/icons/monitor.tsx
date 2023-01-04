import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MonitorBold } from '../bold/monitor-bold'
import { MonitorDuotone } from '../duotone/monitor-duotone'
import { MonitorFill } from '../fill/monitor-fill'
import { MonitorLight } from '../light/monitor-light'
import { MonitorRegular } from '../regular/monitor-regular'
import { MonitorThin } from '../thin/monitor-thin'

const weightMap = {
  regular: MonitorRegular,
  bold: MonitorBold,
  duotone: MonitorDuotone,
  fill: MonitorFill,
  light: MonitorLight,
  thin: MonitorThin,
} as const

export const Monitor = (props: IconProps) => {
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
