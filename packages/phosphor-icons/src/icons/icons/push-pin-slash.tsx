import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PushPinSlashBold } from '../bold/push-pin-slash-bold'
import { PushPinSlashDuotone } from '../duotone/push-pin-slash-duotone'
import { PushPinSlashFill } from '../fill/push-pin-slash-fill'
import { PushPinSlashLight } from '../light/push-pin-slash-light'
import { PushPinSlashRegular } from '../regular/push-pin-slash-regular'
import { PushPinSlashThin } from '../thin/push-pin-slash-thin'

const weightMap = {
  regular: PushPinSlashRegular,
  bold: PushPinSlashBold,
  duotone: PushPinSlashDuotone,
  fill: PushPinSlashFill,
  light: PushPinSlashLight,
  thin: PushPinSlashThin,
} as const

export const PushPinSlash = (props: IconProps) => {
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
