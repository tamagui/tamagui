import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LockSimpleBold } from '../bold/lock-simple-bold'
import { LockSimpleDuotone } from '../duotone/lock-simple-duotone'
import { LockSimpleFill } from '../fill/lock-simple-fill'
import { LockSimpleLight } from '../light/lock-simple-light'
import { LockSimpleRegular } from '../regular/lock-simple-regular'
import { LockSimpleThin } from '../thin/lock-simple-thin'

const weightMap = {
  regular: LockSimpleRegular,
  bold: LockSimpleBold,
  duotone: LockSimpleDuotone,
  fill: LockSimpleFill,
  light: LockSimpleLight,
  thin: LockSimpleThin,
} as const

export const LockSimple = (props: IconProps) => {
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
