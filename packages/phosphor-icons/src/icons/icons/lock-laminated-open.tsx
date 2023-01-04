import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LockLaminatedOpenBold } from '../bold/lock-laminated-open-bold'
import { LockLaminatedOpenDuotone } from '../duotone/lock-laminated-open-duotone'
import { LockLaminatedOpenFill } from '../fill/lock-laminated-open-fill'
import { LockLaminatedOpenLight } from '../light/lock-laminated-open-light'
import { LockLaminatedOpenRegular } from '../regular/lock-laminated-open-regular'
import { LockLaminatedOpenThin } from '../thin/lock-laminated-open-thin'

const weightMap = {
  regular: LockLaminatedOpenRegular,
  bold: LockLaminatedOpenBold,
  duotone: LockLaminatedOpenDuotone,
  fill: LockLaminatedOpenFill,
  light: LockLaminatedOpenLight,
  thin: LockLaminatedOpenThin,
} as const

export const LockLaminatedOpen = (props: IconProps) => {
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
