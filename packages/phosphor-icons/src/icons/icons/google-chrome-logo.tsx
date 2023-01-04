import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GoogleChromeLogoBold } from '../bold/google-chrome-logo-bold'
import { GoogleChromeLogoDuotone } from '../duotone/google-chrome-logo-duotone'
import { GoogleChromeLogoFill } from '../fill/google-chrome-logo-fill'
import { GoogleChromeLogoLight } from '../light/google-chrome-logo-light'
import { GoogleChromeLogoRegular } from '../regular/google-chrome-logo-regular'
import { GoogleChromeLogoThin } from '../thin/google-chrome-logo-thin'

const weightMap = {
  regular: GoogleChromeLogoRegular,
  bold: GoogleChromeLogoBold,
  duotone: GoogleChromeLogoDuotone,
  fill: GoogleChromeLogoFill,
  light: GoogleChromeLogoLight,
  thin: GoogleChromeLogoThin,
} as const

export const GoogleChromeLogo = (props: IconProps) => {
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
