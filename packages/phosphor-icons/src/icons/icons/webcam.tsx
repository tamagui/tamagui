import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WebcamBold } from '../bold/webcam-bold'
import { WebcamDuotone } from '../duotone/webcam-duotone'
import { WebcamFill } from '../fill/webcam-fill'
import { WebcamLight } from '../light/webcam-light'
import { WebcamRegular } from '../regular/webcam-regular'
import { WebcamThin } from '../thin/webcam-thin'

const weightMap = {
  regular: WebcamRegular,
  bold: WebcamBold,
  duotone: WebcamDuotone,
  fill: WebcamFill,
  light: WebcamLight,
  thin: WebcamThin,
} as const

export const Webcam = (props: IconProps) => {
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
