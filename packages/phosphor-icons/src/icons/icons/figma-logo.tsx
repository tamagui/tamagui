import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FigmaLogoBold } from '../bold/figma-logo-bold'
import { FigmaLogoDuotone } from '../duotone/figma-logo-duotone'
import { FigmaLogoFill } from '../fill/figma-logo-fill'
import { FigmaLogoLight } from '../light/figma-logo-light'
import { FigmaLogoRegular } from '../regular/figma-logo-regular'
import { FigmaLogoThin } from '../thin/figma-logo-thin'

const weightMap = {
  regular: FigmaLogoRegular,
  bold: FigmaLogoBold,
  duotone: FigmaLogoDuotone,
  fill: FigmaLogoFill,
  light: FigmaLogoLight,
  thin: FigmaLogoThin,
} as const

export const FigmaLogo = (props: IconProps) => {
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
