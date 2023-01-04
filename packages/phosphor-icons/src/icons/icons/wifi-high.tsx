import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WifiHighBold } from '../bold/wifi-high-bold'
import { WifiHighDuotone } from '../duotone/wifi-high-duotone'
import { WifiHighFill } from '../fill/wifi-high-fill'
import { WifiHighLight } from '../light/wifi-high-light'
import { WifiHighRegular } from '../regular/wifi-high-regular'
import { WifiHighThin } from '../thin/wifi-high-thin'

const weightMap = {
  regular: WifiHighRegular,
  bold: WifiHighBold,
  duotone: WifiHighDuotone,
  fill: WifiHighFill,
  light: WifiHighLight,
  thin: WifiHighThin,
} as const

export const WifiHigh = (props: IconProps) => {
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
