import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PushPinSimpleSlashBold } from '../bold/push-pin-simple-slash-bold'
import { PushPinSimpleSlashDuotone } from '../duotone/push-pin-simple-slash-duotone'
import { PushPinSimpleSlashFill } from '../fill/push-pin-simple-slash-fill'
import { PushPinSimpleSlashLight } from '../light/push-pin-simple-slash-light'
import { PushPinSimpleSlashRegular } from '../regular/push-pin-simple-slash-regular'
import { PushPinSimpleSlashThin } from '../thin/push-pin-simple-slash-thin'

const weightMap = {
  regular: PushPinSimpleSlashRegular,
  bold: PushPinSimpleSlashBold,
  duotone: PushPinSimpleSlashDuotone,
  fill: PushPinSimpleSlashFill,
  light: PushPinSimpleSlashLight,
  thin: PushPinSimpleSlashThin,
} as const

export const PushPinSimpleSlash = (props: IconProps) => {
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
