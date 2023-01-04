import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BellSimpleSlashBold } from '../bold/bell-simple-slash-bold'
import { BellSimpleSlashDuotone } from '../duotone/bell-simple-slash-duotone'
import { BellSimpleSlashFill } from '../fill/bell-simple-slash-fill'
import { BellSimpleSlashLight } from '../light/bell-simple-slash-light'
import { BellSimpleSlashRegular } from '../regular/bell-simple-slash-regular'
import { BellSimpleSlashThin } from '../thin/bell-simple-slash-thin'

const weightMap = {
  regular: BellSimpleSlashRegular,
  bold: BellSimpleSlashBold,
  duotone: BellSimpleSlashDuotone,
  fill: BellSimpleSlashFill,
  light: BellSimpleSlashLight,
  thin: BellSimpleSlashThin,
} as const

export const BellSimpleSlash = (props: IconProps) => {
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
