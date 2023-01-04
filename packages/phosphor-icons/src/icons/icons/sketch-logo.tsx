import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SketchLogoBold } from '../bold/sketch-logo-bold'
import { SketchLogoDuotone } from '../duotone/sketch-logo-duotone'
import { SketchLogoFill } from '../fill/sketch-logo-fill'
import { SketchLogoLight } from '../light/sketch-logo-light'
import { SketchLogoRegular } from '../regular/sketch-logo-regular'
import { SketchLogoThin } from '../thin/sketch-logo-thin'

const weightMap = {
  regular: SketchLogoRegular,
  bold: SketchLogoBold,
  duotone: SketchLogoDuotone,
  fill: SketchLogoFill,
  light: SketchLogoLight,
  thin: SketchLogoThin,
} as const

export const SketchLogo = (props: IconProps) => {
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
