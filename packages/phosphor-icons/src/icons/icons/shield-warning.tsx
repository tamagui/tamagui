import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ShieldWarningBold } from '../bold/shield-warning-bold'
import { ShieldWarningDuotone } from '../duotone/shield-warning-duotone'
import { ShieldWarningFill } from '../fill/shield-warning-fill'
import { ShieldWarningLight } from '../light/shield-warning-light'
import { ShieldWarningRegular } from '../regular/shield-warning-regular'
import { ShieldWarningThin } from '../thin/shield-warning-thin'

const weightMap = {
  regular: ShieldWarningRegular,
  bold: ShieldWarningBold,
  duotone: ShieldWarningDuotone,
  fill: ShieldWarningFill,
  light: ShieldWarningLight,
  thin: ShieldWarningThin,
} as const

export const ShieldWarning = (props: IconProps) => {
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
