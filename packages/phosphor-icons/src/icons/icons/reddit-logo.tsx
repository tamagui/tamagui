import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RedditLogoBold } from '../bold/reddit-logo-bold'
import { RedditLogoDuotone } from '../duotone/reddit-logo-duotone'
import { RedditLogoFill } from '../fill/reddit-logo-fill'
import { RedditLogoLight } from '../light/reddit-logo-light'
import { RedditLogoRegular } from '../regular/reddit-logo-regular'
import { RedditLogoThin } from '../thin/reddit-logo-thin'

const weightMap = {
  regular: RedditLogoRegular,
  bold: RedditLogoBold,
  duotone: RedditLogoDuotone,
  fill: RedditLogoFill,
  light: RedditLogoLight,
  thin: RedditLogoThin,
} as const

export const RedditLogo = (props: IconProps) => {
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
