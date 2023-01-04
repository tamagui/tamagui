import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LockOpenBold } from '../bold/lock-open-bold'
import { LockOpenDuotone } from '../duotone/lock-open-duotone'
import { LockOpenFill } from '../fill/lock-open-fill'
import { LockOpenLight } from '../light/lock-open-light'
import { LockOpenRegular } from '../regular/lock-open-regular'
import { LockOpenThin } from '../thin/lock-open-thin'

const weightMap = {
  regular: LockOpenRegular,
  bold: LockOpenBold,
  duotone: LockOpenDuotone,
  fill: LockOpenFill,
  light: LockOpenLight,
  thin: LockOpenThin,
} as const

export const LockOpen = (props: IconProps) => {
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
