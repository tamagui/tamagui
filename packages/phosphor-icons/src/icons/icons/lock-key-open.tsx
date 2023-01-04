import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LockKeyOpenBold } from '../bold/lock-key-open-bold'
import { LockKeyOpenDuotone } from '../duotone/lock-key-open-duotone'
import { LockKeyOpenFill } from '../fill/lock-key-open-fill'
import { LockKeyOpenLight } from '../light/lock-key-open-light'
import { LockKeyOpenRegular } from '../regular/lock-key-open-regular'
import { LockKeyOpenThin } from '../thin/lock-key-open-thin'

const weightMap = {
  regular: LockKeyOpenRegular,
  bold: LockKeyOpenBold,
  duotone: LockKeyOpenDuotone,
  fill: LockKeyOpenFill,
  light: LockKeyOpenLight,
  thin: LockKeyOpenThin,
} as const

export const LockKeyOpen = (props: IconProps) => {
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
