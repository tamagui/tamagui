import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FramerLogoBold } from '../bold/framer-logo-bold'
import { FramerLogoDuotone } from '../duotone/framer-logo-duotone'
import { FramerLogoFill } from '../fill/framer-logo-fill'
import { FramerLogoLight } from '../light/framer-logo-light'
import { FramerLogoRegular } from '../regular/framer-logo-regular'
import { FramerLogoThin } from '../thin/framer-logo-thin'

const weightMap = {
  regular: FramerLogoRegular,
  bold: FramerLogoBold,
  duotone: FramerLogoDuotone,
  fill: FramerLogoFill,
  light: FramerLogoLight,
  thin: FramerLogoThin,
} as const

export const FramerLogo = (props: IconProps) => {
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
