import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { VideoCameraBold } from '../bold/video-camera-bold'
import { VideoCameraDuotone } from '../duotone/video-camera-duotone'
import { VideoCameraFill } from '../fill/video-camera-fill'
import { VideoCameraLight } from '../light/video-camera-light'
import { VideoCameraRegular } from '../regular/video-camera-regular'
import { VideoCameraThin } from '../thin/video-camera-thin'

const weightMap = {
  regular: VideoCameraRegular,
  bold: VideoCameraBold,
  duotone: VideoCameraDuotone,
  fill: VideoCameraFill,
  light: VideoCameraLight,
  thin: VideoCameraThin,
} as const

export const VideoCamera = (props: IconProps) => {
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
