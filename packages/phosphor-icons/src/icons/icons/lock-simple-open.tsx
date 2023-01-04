import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LockSimpleOpenBold } from '../bold/lock-simple-open-bold'
import { LockSimpleOpenDuotone } from '../duotone/lock-simple-open-duotone'
import { LockSimpleOpenFill } from '../fill/lock-simple-open-fill'
import { LockSimpleOpenLight } from '../light/lock-simple-open-light'
import { LockSimpleOpenRegular } from '../regular/lock-simple-open-regular'
import { LockSimpleOpenThin } from '../thin/lock-simple-open-thin'

const weightMap = {
  regular: LockSimpleOpenRegular,
  bold: LockSimpleOpenBold,
  duotone: LockSimpleOpenDuotone,
  fill: LockSimpleOpenFill,
  light: LockSimpleOpenLight,
  thin: LockSimpleOpenThin,
} as const

export const LockSimpleOpen = (props: IconProps) => {
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
