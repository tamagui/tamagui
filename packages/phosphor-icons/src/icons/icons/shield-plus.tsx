import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ShieldPlusBold } from '../bold/shield-plus-bold'
import { ShieldPlusDuotone } from '../duotone/shield-plus-duotone'
import { ShieldPlusFill } from '../fill/shield-plus-fill'
import { ShieldPlusLight } from '../light/shield-plus-light'
import { ShieldPlusRegular } from '../regular/shield-plus-regular'
import { ShieldPlusThin } from '../thin/shield-plus-thin'

const weightMap = {
  regular: ShieldPlusRegular,
  bold: ShieldPlusBold,
  duotone: ShieldPlusDuotone,
  fill: ShieldPlusFill,
  light: ShieldPlusLight,
  thin: ShieldPlusThin,
} as const

export const ShieldPlus = (props: IconProps) => {
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
