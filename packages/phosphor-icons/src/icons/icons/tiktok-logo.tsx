import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TiktokLogoBold } from '../bold/tiktok-logo-bold'
import { TiktokLogoDuotone } from '../duotone/tiktok-logo-duotone'
import { TiktokLogoFill } from '../fill/tiktok-logo-fill'
import { TiktokLogoLight } from '../light/tiktok-logo-light'
import { TiktokLogoRegular } from '../regular/tiktok-logo-regular'
import { TiktokLogoThin } from '../thin/tiktok-logo-thin'

const weightMap = {
  regular: TiktokLogoRegular,
  bold: TiktokLogoBold,
  duotone: TiktokLogoDuotone,
  fill: TiktokLogoFill,
  light: TiktokLogoLight,
  thin: TiktokLogoThin,
} as const

export const TiktokLogo = (props: IconProps) => {
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
