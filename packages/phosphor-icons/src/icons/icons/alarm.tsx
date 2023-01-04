import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AlarmBold } from '../bold/alarm-bold'
import { AlarmDuotone } from '../duotone/alarm-duotone'
import { AlarmFill } from '../fill/alarm-fill'
import { AlarmLight } from '../light/alarm-light'
import { AlarmRegular } from '../regular/alarm-regular'
import { AlarmThin } from '../thin/alarm-thin'

const weightMap = {
  regular: AlarmRegular,
  bold: AlarmBold,
  duotone: AlarmDuotone,
  fill: AlarmFill,
  light: AlarmLight,
  thin: AlarmThin,
} as const

export const Alarm = (props: IconProps) => {
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
