import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GoogleLogoBold } from '../bold/google-logo-bold'
import { GoogleLogoDuotone } from '../duotone/google-logo-duotone'
import { GoogleLogoFill } from '../fill/google-logo-fill'
import { GoogleLogoLight } from '../light/google-logo-light'
import { GoogleLogoRegular } from '../regular/google-logo-regular'
import { GoogleLogoThin } from '../thin/google-logo-thin'

const weightMap = {
  regular: GoogleLogoRegular,
  bold: GoogleLogoBold,
  duotone: GoogleLogoDuotone,
  fill: GoogleLogoFill,
  light: GoogleLogoLight,
  thin: GoogleLogoThin,
} as const

export const GoogleLogo = (props: IconProps) => {
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
