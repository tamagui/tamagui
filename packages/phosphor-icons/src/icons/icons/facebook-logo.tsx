import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FacebookLogoBold } from '../bold/facebook-logo-bold'
import { FacebookLogoDuotone } from '../duotone/facebook-logo-duotone'
import { FacebookLogoFill } from '../fill/facebook-logo-fill'
import { FacebookLogoLight } from '../light/facebook-logo-light'
import { FacebookLogoRegular } from '../regular/facebook-logo-regular'
import { FacebookLogoThin } from '../thin/facebook-logo-thin'

const weightMap = {
  regular: FacebookLogoRegular,
  bold: FacebookLogoBold,
  duotone: FacebookLogoDuotone,
  fill: FacebookLogoFill,
  light: FacebookLogoLight,
  thin: FacebookLogoThin,
} as const

export const FacebookLogo = (props: IconProps) => {
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
