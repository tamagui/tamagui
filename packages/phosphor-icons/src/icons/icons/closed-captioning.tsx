import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ClosedCaptioningBold } from '../bold/closed-captioning-bold'
import { ClosedCaptioningDuotone } from '../duotone/closed-captioning-duotone'
import { ClosedCaptioningFill } from '../fill/closed-captioning-fill'
import { ClosedCaptioningLight } from '../light/closed-captioning-light'
import { ClosedCaptioningRegular } from '../regular/closed-captioning-regular'
import { ClosedCaptioningThin } from '../thin/closed-captioning-thin'

const weightMap = {
  regular: ClosedCaptioningRegular,
  bold: ClosedCaptioningBold,
  duotone: ClosedCaptioningDuotone,
  fill: ClosedCaptioningFill,
  light: ClosedCaptioningLight,
  thin: ClosedCaptioningThin,
} as const

export const ClosedCaptioning = (props: IconProps) => {
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
