import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MagnifyingGlassPlusBold } from '../bold/magnifying-glass-plus-bold'
import { MagnifyingGlassPlusDuotone } from '../duotone/magnifying-glass-plus-duotone'
import { MagnifyingGlassPlusFill } from '../fill/magnifying-glass-plus-fill'
import { MagnifyingGlassPlusLight } from '../light/magnifying-glass-plus-light'
import { MagnifyingGlassPlusRegular } from '../regular/magnifying-glass-plus-regular'
import { MagnifyingGlassPlusThin } from '../thin/magnifying-glass-plus-thin'

const weightMap = {
  regular: MagnifyingGlassPlusRegular,
  bold: MagnifyingGlassPlusBold,
  duotone: MagnifyingGlassPlusDuotone,
  fill: MagnifyingGlassPlusFill,
  light: MagnifyingGlassPlusLight,
  thin: MagnifyingGlassPlusThin,
} as const

export const MagnifyingGlassPlus = (props: IconProps) => {
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
