import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CookieBold } from '../bold/cookie-bold'
import { CookieDuotone } from '../duotone/cookie-duotone'
import { CookieFill } from '../fill/cookie-fill'
import { CookieLight } from '../light/cookie-light'
import { CookieRegular } from '../regular/cookie-regular'
import { CookieThin } from '../thin/cookie-thin'

const weightMap = {
  regular: CookieRegular,
  bold: CookieBold,
  duotone: CookieDuotone,
  fill: CookieFill,
  light: CookieLight,
  thin: CookieThin,
} as const

export const Cookie = (props: IconProps) => {
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
