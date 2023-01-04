import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DeviceMobileCameraBold } from '../bold/device-mobile-camera-bold'
import { DeviceMobileCameraDuotone } from '../duotone/device-mobile-camera-duotone'
import { DeviceMobileCameraFill } from '../fill/device-mobile-camera-fill'
import { DeviceMobileCameraLight } from '../light/device-mobile-camera-light'
import { DeviceMobileCameraRegular } from '../regular/device-mobile-camera-regular'
import { DeviceMobileCameraThin } from '../thin/device-mobile-camera-thin'

const weightMap = {
  regular: DeviceMobileCameraRegular,
  bold: DeviceMobileCameraBold,
  duotone: DeviceMobileCameraDuotone,
  fill: DeviceMobileCameraFill,
  light: DeviceMobileCameraLight,
  thin: DeviceMobileCameraThin,
} as const

export const DeviceMobileCamera = (props: IconProps) => {
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
