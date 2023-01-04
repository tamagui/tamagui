import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LockKeyBold } from '../bold/lock-key-bold'
import { LockKeyDuotone } from '../duotone/lock-key-duotone'
import { LockKeyFill } from '../fill/lock-key-fill'
import { LockKeyLight } from '../light/lock-key-light'
import { LockKeyRegular } from '../regular/lock-key-regular'
import { LockKeyThin } from '../thin/lock-key-thin'

const weightMap = {
  regular: LockKeyRegular,
  bold: LockKeyBold,
  duotone: LockKeyDuotone,
  fill: LockKeyFill,
  light: LockKeyLight,
  thin: LockKeyThin,
} as const

export const LockKey = (props: IconProps) => {
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
