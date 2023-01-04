import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MagnifyingGlassMinusBold } from '../bold/magnifying-glass-minus-bold'
import { MagnifyingGlassMinusDuotone } from '../duotone/magnifying-glass-minus-duotone'
import { MagnifyingGlassMinusFill } from '../fill/magnifying-glass-minus-fill'
import { MagnifyingGlassMinusLight } from '../light/magnifying-glass-minus-light'
import { MagnifyingGlassMinusRegular } from '../regular/magnifying-glass-minus-regular'
import { MagnifyingGlassMinusThin } from '../thin/magnifying-glass-minus-thin'

const weightMap = {
  regular: MagnifyingGlassMinusRegular,
  bold: MagnifyingGlassMinusBold,
  duotone: MagnifyingGlassMinusDuotone,
  fill: MagnifyingGlassMinusFill,
  light: MagnifyingGlassMinusLight,
  thin: MagnifyingGlassMinusThin,
} as const

export const MagnifyingGlassMinus = (props: IconProps) => {
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
