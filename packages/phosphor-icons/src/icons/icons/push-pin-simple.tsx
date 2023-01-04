import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PushPinSimpleBold } from '../bold/push-pin-simple-bold'
import { PushPinSimpleDuotone } from '../duotone/push-pin-simple-duotone'
import { PushPinSimpleFill } from '../fill/push-pin-simple-fill'
import { PushPinSimpleLight } from '../light/push-pin-simple-light'
import { PushPinSimpleRegular } from '../regular/push-pin-simple-regular'
import { PushPinSimpleThin } from '../thin/push-pin-simple-thin'

const weightMap = {
  regular: PushPinSimpleRegular,
  bold: PushPinSimpleBold,
  duotone: PushPinSimpleDuotone,
  fill: PushPinSimpleFill,
  light: PushPinSimpleLight,
  thin: PushPinSimpleThin,
} as const

export const PushPinSimple = (props: IconProps) => {
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
