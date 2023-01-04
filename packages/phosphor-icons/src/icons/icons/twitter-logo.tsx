import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TwitterLogoBold } from '../bold/twitter-logo-bold'
import { TwitterLogoDuotone } from '../duotone/twitter-logo-duotone'
import { TwitterLogoFill } from '../fill/twitter-logo-fill'
import { TwitterLogoLight } from '../light/twitter-logo-light'
import { TwitterLogoRegular } from '../regular/twitter-logo-regular'
import { TwitterLogoThin } from '../thin/twitter-logo-thin'

const weightMap = {
  regular: TwitterLogoRegular,
  bold: TwitterLogoBold,
  duotone: TwitterLogoDuotone,
  fill: TwitterLogoFill,
  light: TwitterLogoLight,
  thin: TwitterLogoThin,
} as const

export const TwitterLogo = (props: IconProps) => {
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
