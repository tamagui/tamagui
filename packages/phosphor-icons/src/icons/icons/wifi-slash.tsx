import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WifiSlashBold } from '../bold/wifi-slash-bold'
import { WifiSlashDuotone } from '../duotone/wifi-slash-duotone'
import { WifiSlashFill } from '../fill/wifi-slash-fill'
import { WifiSlashLight } from '../light/wifi-slash-light'
import { WifiSlashRegular } from '../regular/wifi-slash-regular'
import { WifiSlashThin } from '../thin/wifi-slash-thin'

const weightMap = {
  regular: WifiSlashRegular,
  bold: WifiSlashBold,
  duotone: WifiSlashDuotone,
  fill: WifiSlashFill,
  light: WifiSlashLight,
  thin: WifiSlashThin,
} as const

export const WifiSlash = (props: IconProps) => {
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
