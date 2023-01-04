import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PaletteBold } from '../bold/palette-bold'
import { PaletteDuotone } from '../duotone/palette-duotone'
import { PaletteFill } from '../fill/palette-fill'
import { PaletteLight } from '../light/palette-light'
import { PaletteRegular } from '../regular/palette-regular'
import { PaletteThin } from '../thin/palette-thin'

const weightMap = {
  regular: PaletteRegular,
  bold: PaletteBold,
  duotone: PaletteDuotone,
  fill: PaletteFill,
  light: PaletteLight,
  thin: PaletteThin,
} as const

export const Palette = (props: IconProps) => {
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
