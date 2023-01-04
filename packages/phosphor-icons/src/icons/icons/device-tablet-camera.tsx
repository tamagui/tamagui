import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DeviceTabletCameraBold } from '../bold/device-tablet-camera-bold'
import { DeviceTabletCameraDuotone } from '../duotone/device-tablet-camera-duotone'
import { DeviceTabletCameraFill } from '../fill/device-tablet-camera-fill'
import { DeviceTabletCameraLight } from '../light/device-tablet-camera-light'
import { DeviceTabletCameraRegular } from '../regular/device-tablet-camera-regular'
import { DeviceTabletCameraThin } from '../thin/device-tablet-camera-thin'

const weightMap = {
  regular: DeviceTabletCameraRegular,
  bold: DeviceTabletCameraBold,
  duotone: DeviceTabletCameraDuotone,
  fill: DeviceTabletCameraFill,
  light: DeviceTabletCameraLight,
  thin: DeviceTabletCameraThin,
} as const

export const DeviceTabletCamera = (props: IconProps) => {
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
