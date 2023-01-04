import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DeviceTabletBold } from '../bold/device-tablet-bold'
import { DeviceTabletDuotone } from '../duotone/device-tablet-duotone'
import { DeviceTabletFill } from '../fill/device-tablet-fill'
import { DeviceTabletLight } from '../light/device-tablet-light'
import { DeviceTabletRegular } from '../regular/device-tablet-regular'
import { DeviceTabletThin } from '../thin/device-tablet-thin'

const weightMap = {
  regular: DeviceTabletRegular,
  bold: DeviceTabletBold,
  duotone: DeviceTabletDuotone,
  fill: DeviceTabletFill,
  light: DeviceTabletLight,
  thin: DeviceTabletThin,
} as const

export const DeviceTablet = (props: IconProps) => {
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
