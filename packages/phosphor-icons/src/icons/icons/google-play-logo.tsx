import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GooglePlayLogoBold } from '../bold/google-play-logo-bold'
import { GooglePlayLogoDuotone } from '../duotone/google-play-logo-duotone'
import { GooglePlayLogoFill } from '../fill/google-play-logo-fill'
import { GooglePlayLogoLight } from '../light/google-play-logo-light'
import { GooglePlayLogoRegular } from '../regular/google-play-logo-regular'
import { GooglePlayLogoThin } from '../thin/google-play-logo-thin'

const weightMap = {
  regular: GooglePlayLogoRegular,
  bold: GooglePlayLogoBold,
  duotone: GooglePlayLogoDuotone,
  fill: GooglePlayLogoFill,
  light: GooglePlayLogoLight,
  thin: GooglePlayLogoThin,
} as const

export const GooglePlayLogo = (props: IconProps) => {
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
