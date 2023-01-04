import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { VideoCameraSlashBold } from '../bold/video-camera-slash-bold'
import { VideoCameraSlashDuotone } from '../duotone/video-camera-slash-duotone'
import { VideoCameraSlashFill } from '../fill/video-camera-slash-fill'
import { VideoCameraSlashLight } from '../light/video-camera-slash-light'
import { VideoCameraSlashRegular } from '../regular/video-camera-slash-regular'
import { VideoCameraSlashThin } from '../thin/video-camera-slash-thin'

const weightMap = {
  regular: VideoCameraSlashRegular,
  bold: VideoCameraSlashBold,
  duotone: VideoCameraSlashDuotone,
  fill: VideoCameraSlashFill,
  light: VideoCameraSlashLight,
  thin: VideoCameraSlashThin,
} as const

export const VideoCameraSlash = (props: IconProps) => {
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
