import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ShieldCheckBold } from '../bold/shield-check-bold'
import { ShieldCheckDuotone } from '../duotone/shield-check-duotone'
import { ShieldCheckFill } from '../fill/shield-check-fill'
import { ShieldCheckLight } from '../light/shield-check-light'
import { ShieldCheckRegular } from '../regular/shield-check-regular'
import { ShieldCheckThin } from '../thin/shield-check-thin'

const weightMap = {
  regular: ShieldCheckRegular,
  bold: ShieldCheckBold,
  duotone: ShieldCheckDuotone,
  fill: ShieldCheckFill,
  light: ShieldCheckLight,
  thin: ShieldCheckThin,
} as const

export const ShieldCheck = (props: IconProps) => {
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
