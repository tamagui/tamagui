import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PlugsConnectedBold } from '../bold/plugs-connected-bold'
import { PlugsConnectedDuotone } from '../duotone/plugs-connected-duotone'
import { PlugsConnectedFill } from '../fill/plugs-connected-fill'
import { PlugsConnectedLight } from '../light/plugs-connected-light'
import { PlugsConnectedRegular } from '../regular/plugs-connected-regular'
import { PlugsConnectedThin } from '../thin/plugs-connected-thin'

const weightMap = {
  regular: PlugsConnectedRegular,
  bold: PlugsConnectedBold,
  duotone: PlugsConnectedDuotone,
  fill: PlugsConnectedFill,
  light: PlugsConnectedLight,
  thin: PlugsConnectedThin,
} as const

export const PlugsConnected = (props: IconProps) => {
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
