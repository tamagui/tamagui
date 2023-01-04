import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BroadcastBold } from '../bold/broadcast-bold'
import { BroadcastDuotone } from '../duotone/broadcast-duotone'
import { BroadcastFill } from '../fill/broadcast-fill'
import { BroadcastLight } from '../light/broadcast-light'
import { BroadcastRegular } from '../regular/broadcast-regular'
import { BroadcastThin } from '../thin/broadcast-thin'

const weightMap = {
  regular: BroadcastRegular,
  bold: BroadcastBold,
  duotone: BroadcastDuotone,
  fill: BroadcastFill,
  light: BroadcastLight,
  thin: BroadcastThin,
} as const

export const Broadcast = (props: IconProps) => {
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
