import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CameraRotateBold } from '../bold/camera-rotate-bold'
import { CameraRotateDuotone } from '../duotone/camera-rotate-duotone'
import { CameraRotateFill } from '../fill/camera-rotate-fill'
import { CameraRotateLight } from '../light/camera-rotate-light'
import { CameraRotateRegular } from '../regular/camera-rotate-regular'
import { CameraRotateThin } from '../thin/camera-rotate-thin'

const weightMap = {
  regular: CameraRotateRegular,
  bold: CameraRotateBold,
  duotone: CameraRotateDuotone,
  fill: CameraRotateFill,
  light: CameraRotateLight,
  thin: CameraRotateThin,
} as const

export const CameraRotate = (props: IconProps) => {
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
