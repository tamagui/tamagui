import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GooglePhotosLogoBold } from '../bold/google-photos-logo-bold'
import { GooglePhotosLogoDuotone } from '../duotone/google-photos-logo-duotone'
import { GooglePhotosLogoFill } from '../fill/google-photos-logo-fill'
import { GooglePhotosLogoLight } from '../light/google-photos-logo-light'
import { GooglePhotosLogoRegular } from '../regular/google-photos-logo-regular'
import { GooglePhotosLogoThin } from '../thin/google-photos-logo-thin'

const weightMap = {
  regular: GooglePhotosLogoRegular,
  bold: GooglePhotosLogoBold,
  duotone: GooglePhotosLogoDuotone,
  fill: GooglePhotosLogoFill,
  light: GooglePhotosLogoLight,
  thin: GooglePhotosLogoThin,
} as const

export const GooglePhotosLogo = (props: IconProps) => {
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
