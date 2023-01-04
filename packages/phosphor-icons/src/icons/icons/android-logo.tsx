import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AndroidLogoBold } from '../bold/android-logo-bold'
import { AndroidLogoDuotone } from '../duotone/android-logo-duotone'
import { AndroidLogoFill } from '../fill/android-logo-fill'
import { AndroidLogoLight } from '../light/android-logo-light'
import { AndroidLogoRegular } from '../regular/android-logo-regular'
import { AndroidLogoThin } from '../thin/android-logo-thin'

const weightMap = {
  regular: AndroidLogoRegular,
  bold: AndroidLogoBold,
  duotone: AndroidLogoDuotone,
  fill: AndroidLogoFill,
  light: AndroidLogoLight,
  thin: AndroidLogoThin,
} as const

export const AndroidLogo = (props: IconProps) => {
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
