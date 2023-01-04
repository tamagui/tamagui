import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FrameCornersBold } from '../bold/frame-corners-bold'
import { FrameCornersDuotone } from '../duotone/frame-corners-duotone'
import { FrameCornersFill } from '../fill/frame-corners-fill'
import { FrameCornersLight } from '../light/frame-corners-light'
import { FrameCornersRegular } from '../regular/frame-corners-regular'
import { FrameCornersThin } from '../thin/frame-corners-thin'

const weightMap = {
  regular: FrameCornersRegular,
  bold: FrameCornersBold,
  duotone: FrameCornersDuotone,
  fill: FrameCornersFill,
  light: FrameCornersLight,
  thin: FrameCornersThin,
} as const

export const FrameCorners = (props: IconProps) => {
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
