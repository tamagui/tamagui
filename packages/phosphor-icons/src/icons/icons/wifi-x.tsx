import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WifiXBold } from '../bold/wifi-x-bold'
import { WifiXDuotone } from '../duotone/wifi-x-duotone'
import { WifiXFill } from '../fill/wifi-x-fill'
import { WifiXLight } from '../light/wifi-x-light'
import { WifiXRegular } from '../regular/wifi-x-regular'
import { WifiXThin } from '../thin/wifi-x-thin'

const weightMap = {
  regular: WifiXRegular,
  bold: WifiXBold,
  duotone: WifiXDuotone,
  fill: WifiXFill,
  light: WifiXLight,
  thin: WifiXThin,
} as const

export const WifiX = (props: IconProps) => {
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
