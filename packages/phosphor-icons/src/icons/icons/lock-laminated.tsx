import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LockLaminatedBold } from '../bold/lock-laminated-bold'
import { LockLaminatedDuotone } from '../duotone/lock-laminated-duotone'
import { LockLaminatedFill } from '../fill/lock-laminated-fill'
import { LockLaminatedLight } from '../light/lock-laminated-light'
import { LockLaminatedRegular } from '../regular/lock-laminated-regular'
import { LockLaminatedThin } from '../thin/lock-laminated-thin'

const weightMap = {
  regular: LockLaminatedRegular,
  bold: LockLaminatedBold,
  duotone: LockLaminatedDuotone,
  fill: LockLaminatedFill,
  light: LockLaminatedLight,
  thin: LockLaminatedThin,
} as const

export const LockLaminated = (props: IconProps) => {
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
