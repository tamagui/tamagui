import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LockBold } from '../bold/lock-bold'
import { LockDuotone } from '../duotone/lock-duotone'
import { LockFill } from '../fill/lock-fill'
import { LockLight } from '../light/lock-light'
import { LockRegular } from '../regular/lock-regular'
import { LockThin } from '../thin/lock-thin'

const weightMap = {
  regular: LockRegular,
  bold: LockBold,
  duotone: LockDuotone,
  fill: LockFill,
  light: LockLight,
  thin: LockThin,
} as const

export const Lock = (props: IconProps) => {
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
