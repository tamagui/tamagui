import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { StorefrontBold } from '../bold/storefront-bold'
import { StorefrontDuotone } from '../duotone/storefront-duotone'
import { StorefrontFill } from '../fill/storefront-fill'
import { StorefrontLight } from '../light/storefront-light'
import { StorefrontRegular } from '../regular/storefront-regular'
import { StorefrontThin } from '../thin/storefront-thin'

const weightMap = {
  regular: StorefrontRegular,
  bold: StorefrontBold,
  duotone: StorefrontDuotone,
  fill: StorefrontFill,
  light: StorefrontLight,
  thin: StorefrontThin,
} as const

export const Storefront = (props: IconProps) => {
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
