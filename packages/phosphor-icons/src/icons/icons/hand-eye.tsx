import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HandEyeBold } from '../bold/hand-eye-bold'
import { HandEyeDuotone } from '../duotone/hand-eye-duotone'
import { HandEyeFill } from '../fill/hand-eye-fill'
import { HandEyeLight } from '../light/hand-eye-light'
import { HandEyeRegular } from '../regular/hand-eye-regular'
import { HandEyeThin } from '../thin/hand-eye-thin'

const weightMap = {
  regular: HandEyeRegular,
  bold: HandEyeBold,
  duotone: HandEyeDuotone,
  fill: HandEyeFill,
  light: HandEyeLight,
  thin: HandEyeThin,
} as const

export const HandEye = (props: IconProps) => {
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
