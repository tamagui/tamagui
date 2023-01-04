import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ShieldSlashBold } from '../bold/shield-slash-bold'
import { ShieldSlashDuotone } from '../duotone/shield-slash-duotone'
import { ShieldSlashFill } from '../fill/shield-slash-fill'
import { ShieldSlashLight } from '../light/shield-slash-light'
import { ShieldSlashRegular } from '../regular/shield-slash-regular'
import { ShieldSlashThin } from '../thin/shield-slash-thin'

const weightMap = {
  regular: ShieldSlashRegular,
  bold: ShieldSlashBold,
  duotone: ShieldSlashDuotone,
  fill: ShieldSlashFill,
  light: ShieldSlashLight,
  thin: ShieldSlashThin,
} as const

export const ShieldSlash = (props: IconProps) => {
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
