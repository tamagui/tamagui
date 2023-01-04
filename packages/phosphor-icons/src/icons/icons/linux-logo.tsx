import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LinuxLogoBold } from '../bold/linux-logo-bold'
import { LinuxLogoDuotone } from '../duotone/linux-logo-duotone'
import { LinuxLogoFill } from '../fill/linux-logo-fill'
import { LinuxLogoLight } from '../light/linux-logo-light'
import { LinuxLogoRegular } from '../regular/linux-logo-regular'
import { LinuxLogoThin } from '../thin/linux-logo-thin'

const weightMap = {
  regular: LinuxLogoRegular,
  bold: LinuxLogoBold,
  duotone: LinuxLogoDuotone,
  fill: LinuxLogoFill,
  light: LinuxLogoLight,
  thin: LinuxLogoThin,
} as const

export const LinuxLogo = (props: IconProps) => {
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
