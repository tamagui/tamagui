import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PlugsBold } from '../bold/plugs-bold'
import { PlugsDuotone } from '../duotone/plugs-duotone'
import { PlugsFill } from '../fill/plugs-fill'
import { PlugsLight } from '../light/plugs-light'
import { PlugsRegular } from '../regular/plugs-regular'
import { PlugsThin } from '../thin/plugs-thin'

const weightMap = {
  regular: PlugsRegular,
  bold: PlugsBold,
  duotone: PlugsDuotone,
  fill: PlugsFill,
  light: PlugsLight,
  thin: PlugsThin,
} as const

export const Plugs = (props: IconProps) => {
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
