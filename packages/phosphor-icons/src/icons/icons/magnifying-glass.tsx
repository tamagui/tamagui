import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MagnifyingGlassBold } from '../bold/magnifying-glass-bold'
import { MagnifyingGlassDuotone } from '../duotone/magnifying-glass-duotone'
import { MagnifyingGlassFill } from '../fill/magnifying-glass-fill'
import { MagnifyingGlassLight } from '../light/magnifying-glass-light'
import { MagnifyingGlassRegular } from '../regular/magnifying-glass-regular'
import { MagnifyingGlassThin } from '../thin/magnifying-glass-thin'

const weightMap = {
  regular: MagnifyingGlassRegular,
  bold: MagnifyingGlassBold,
  duotone: MagnifyingGlassDuotone,
  fill: MagnifyingGlassFill,
  light: MagnifyingGlassLight,
  thin: MagnifyingGlassThin,
} as const

export const MagnifyingGlass = (props: IconProps) => {
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
