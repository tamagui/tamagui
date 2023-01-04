import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AngularLogoBold } from '../bold/angular-logo-bold'
import { AngularLogoDuotone } from '../duotone/angular-logo-duotone'
import { AngularLogoFill } from '../fill/angular-logo-fill'
import { AngularLogoLight } from '../light/angular-logo-light'
import { AngularLogoRegular } from '../regular/angular-logo-regular'
import { AngularLogoThin } from '../thin/angular-logo-thin'

const weightMap = {
  regular: AngularLogoRegular,
  bold: AngularLogoBold,
  duotone: AngularLogoDuotone,
  fill: AngularLogoFill,
  light: AngularLogoLight,
  thin: AngularLogoThin,
} as const

export const AngularLogo = (props: IconProps) => {
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
