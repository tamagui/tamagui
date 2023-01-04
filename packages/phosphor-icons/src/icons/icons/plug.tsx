import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PlugBold } from '../bold/plug-bold'
import { PlugDuotone } from '../duotone/plug-duotone'
import { PlugFill } from '../fill/plug-fill'
import { PlugLight } from '../light/plug-light'
import { PlugRegular } from '../regular/plug-regular'
import { PlugThin } from '../thin/plug-thin'

const weightMap = {
  regular: PlugRegular,
  bold: PlugBold,
  duotone: PlugDuotone,
  fill: PlugFill,
  light: PlugLight,
  thin: PlugThin,
} as const

export const Plug = (props: IconProps) => {
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
