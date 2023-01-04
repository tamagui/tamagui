import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BellSlashBold } from '../bold/bell-slash-bold'
import { BellSlashDuotone } from '../duotone/bell-slash-duotone'
import { BellSlashFill } from '../fill/bell-slash-fill'
import { BellSlashLight } from '../light/bell-slash-light'
import { BellSlashRegular } from '../regular/bell-slash-regular'
import { BellSlashThin } from '../thin/bell-slash-thin'

const weightMap = {
  regular: BellSlashRegular,
  bold: BellSlashBold,
  duotone: BellSlashDuotone,
  fill: BellSlashFill,
  light: BellSlashLight,
  thin: BellSlashThin,
} as const

export const BellSlash = (props: IconProps) => {
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
