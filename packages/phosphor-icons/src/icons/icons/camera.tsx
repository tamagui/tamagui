import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CameraBold } from '../bold/camera-bold'
import { CameraDuotone } from '../duotone/camera-duotone'
import { CameraFill } from '../fill/camera-fill'
import { CameraLight } from '../light/camera-light'
import { CameraRegular } from '../regular/camera-regular'
import { CameraThin } from '../thin/camera-thin'

const weightMap = {
  regular: CameraRegular,
  bold: CameraBold,
  duotone: CameraDuotone,
  fill: CameraFill,
  light: CameraLight,
  thin: CameraThin,
} as const

export const Camera = (props: IconProps) => {
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
