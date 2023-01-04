import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AppleLogoBold } from '../bold/apple-logo-bold'
import { AppleLogoDuotone } from '../duotone/apple-logo-duotone'
import { AppleLogoFill } from '../fill/apple-logo-fill'
import { AppleLogoLight } from '../light/apple-logo-light'
import { AppleLogoRegular } from '../regular/apple-logo-regular'
import { AppleLogoThin } from '../thin/apple-logo-thin'

const weightMap = {
  regular: AppleLogoRegular,
  bold: AppleLogoBold,
  duotone: AppleLogoDuotone,
  fill: AppleLogoFill,
  light: AppleLogoLight,
  thin: AppleLogoThin,
} as const

export const AppleLogo = (props: IconProps) => {
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
