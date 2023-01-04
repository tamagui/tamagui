import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HandGrabbingBold } from '../bold/hand-grabbing-bold'
import { HandGrabbingDuotone } from '../duotone/hand-grabbing-duotone'
import { HandGrabbingFill } from '../fill/hand-grabbing-fill'
import { HandGrabbingLight } from '../light/hand-grabbing-light'
import { HandGrabbingRegular } from '../regular/hand-grabbing-regular'
import { HandGrabbingThin } from '../thin/hand-grabbing-thin'

const weightMap = {
  regular: HandGrabbingRegular,
  bold: HandGrabbingBold,
  duotone: HandGrabbingDuotone,
  fill: HandGrabbingFill,
  light: HandGrabbingLight,
  thin: HandGrabbingThin,
} as const

export const HandGrabbing = (props: IconProps) => {
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
