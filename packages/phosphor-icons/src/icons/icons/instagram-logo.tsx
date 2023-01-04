import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { InstagramLogoBold } from '../bold/instagram-logo-bold'
import { InstagramLogoDuotone } from '../duotone/instagram-logo-duotone'
import { InstagramLogoFill } from '../fill/instagram-logo-fill'
import { InstagramLogoLight } from '../light/instagram-logo-light'
import { InstagramLogoRegular } from '../regular/instagram-logo-regular'
import { InstagramLogoThin } from '../thin/instagram-logo-thin'

const weightMap = {
  regular: InstagramLogoRegular,
  bold: InstagramLogoBold,
  duotone: InstagramLogoDuotone,
  fill: InstagramLogoFill,
  light: InstagramLogoLight,
  thin: InstagramLogoThin,
} as const

export const InstagramLogo = (props: IconProps) => {
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
