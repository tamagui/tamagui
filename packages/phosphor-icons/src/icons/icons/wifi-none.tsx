import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WifiNoneBold } from '../bold/wifi-none-bold'
import { WifiNoneDuotone } from '../duotone/wifi-none-duotone'
import { WifiNoneFill } from '../fill/wifi-none-fill'
import { WifiNoneLight } from '../light/wifi-none-light'
import { WifiNoneRegular } from '../regular/wifi-none-regular'
import { WifiNoneThin } from '../thin/wifi-none-thin'

const weightMap = {
  regular: WifiNoneRegular,
  bold: WifiNoneBold,
  duotone: WifiNoneDuotone,
  fill: WifiNoneFill,
  light: WifiNoneLight,
  thin: WifiNoneThin,
} as const

export const WifiNone = (props: IconProps) => {
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
