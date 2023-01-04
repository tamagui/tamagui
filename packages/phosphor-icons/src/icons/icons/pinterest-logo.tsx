import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PinterestLogoBold } from '../bold/pinterest-logo-bold'
import { PinterestLogoDuotone } from '../duotone/pinterest-logo-duotone'
import { PinterestLogoFill } from '../fill/pinterest-logo-fill'
import { PinterestLogoLight } from '../light/pinterest-logo-light'
import { PinterestLogoRegular } from '../regular/pinterest-logo-regular'
import { PinterestLogoThin } from '../thin/pinterest-logo-thin'

const weightMap = {
  regular: PinterestLogoRegular,
  bold: PinterestLogoBold,
  duotone: PinterestLogoDuotone,
  fill: PinterestLogoFill,
  light: PinterestLogoLight,
  thin: PinterestLogoThin,
} as const

export const PinterestLogo = (props: IconProps) => {
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
