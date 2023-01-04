import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WifiLowBold } from '../bold/wifi-low-bold'
import { WifiLowDuotone } from '../duotone/wifi-low-duotone'
import { WifiLowFill } from '../fill/wifi-low-fill'
import { WifiLowLight } from '../light/wifi-low-light'
import { WifiLowRegular } from '../regular/wifi-low-regular'
import { WifiLowThin } from '../thin/wifi-low-thin'

const weightMap = {
  regular: WifiLowRegular,
  bold: WifiLowBold,
  duotone: WifiLowDuotone,
  fill: WifiLowFill,
  light: WifiLowLight,
  thin: WifiLowThin,
} as const

export const WifiLow = (props: IconProps) => {
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
