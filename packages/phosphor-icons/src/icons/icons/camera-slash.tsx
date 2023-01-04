import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CameraSlashBold } from '../bold/camera-slash-bold'
import { CameraSlashDuotone } from '../duotone/camera-slash-duotone'
import { CameraSlashFill } from '../fill/camera-slash-fill'
import { CameraSlashLight } from '../light/camera-slash-light'
import { CameraSlashRegular } from '../regular/camera-slash-regular'
import { CameraSlashThin } from '../thin/camera-slash-thin'

const weightMap = {
  regular: CameraSlashRegular,
  bold: CameraSlashBold,
  duotone: CameraSlashDuotone,
  fill: CameraSlashFill,
  light: CameraSlashLight,
  thin: CameraSlashThin,
} as const

export const CameraSlash = (props: IconProps) => {
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
