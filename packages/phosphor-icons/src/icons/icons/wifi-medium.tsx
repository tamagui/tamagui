import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WifiMediumBold } from '../bold/wifi-medium-bold'
import { WifiMediumDuotone } from '../duotone/wifi-medium-duotone'
import { WifiMediumFill } from '../fill/wifi-medium-fill'
import { WifiMediumLight } from '../light/wifi-medium-light'
import { WifiMediumRegular } from '../regular/wifi-medium-regular'
import { WifiMediumThin } from '../thin/wifi-medium-thin'

const weightMap = {
  regular: WifiMediumRegular,
  bold: WifiMediumBold,
  duotone: WifiMediumDuotone,
  fill: WifiMediumFill,
  light: WifiMediumLight,
  thin: WifiMediumThin,
} as const

export const WifiMedium = (props: IconProps) => {
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
