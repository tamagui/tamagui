import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LinkedinLogoBold } from '../bold/linkedin-logo-bold'
import { LinkedinLogoDuotone } from '../duotone/linkedin-logo-duotone'
import { LinkedinLogoFill } from '../fill/linkedin-logo-fill'
import { LinkedinLogoLight } from '../light/linkedin-logo-light'
import { LinkedinLogoRegular } from '../regular/linkedin-logo-regular'
import { LinkedinLogoThin } from '../thin/linkedin-logo-thin'

const weightMap = {
  regular: LinkedinLogoRegular,
  bold: LinkedinLogoBold,
  duotone: LinkedinLogoDuotone,
  fill: LinkedinLogoFill,
  light: LinkedinLogoLight,
  thin: LinkedinLogoThin,
} as const

export const LinkedinLogo = (props: IconProps) => {
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
