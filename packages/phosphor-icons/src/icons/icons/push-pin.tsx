import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PushPinBold } from '../bold/push-pin-bold'
import { PushPinDuotone } from '../duotone/push-pin-duotone'
import { PushPinFill } from '../fill/push-pin-fill'
import { PushPinLight } from '../light/push-pin-light'
import { PushPinRegular } from '../regular/push-pin-regular'
import { PushPinThin } from '../thin/push-pin-thin'

const weightMap = {
  regular: PushPinRegular,
  bold: PushPinBold,
  duotone: PushPinDuotone,
  fill: PushPinFill,
  light: PushPinLight,
  thin: PushPinThin,
} as const

export const PushPin = (props: IconProps) => {
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
