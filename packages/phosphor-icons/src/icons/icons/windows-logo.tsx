import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WindowsLogoBold } from '../bold/windows-logo-bold'
import { WindowsLogoDuotone } from '../duotone/windows-logo-duotone'
import { WindowsLogoFill } from '../fill/windows-logo-fill'
import { WindowsLogoLight } from '../light/windows-logo-light'
import { WindowsLogoRegular } from '../regular/windows-logo-regular'
import { WindowsLogoThin } from '../thin/windows-logo-thin'

const weightMap = {
  regular: WindowsLogoRegular,
  bold: WindowsLogoBold,
  duotone: WindowsLogoDuotone,
  fill: WindowsLogoFill,
  light: WindowsLogoLight,
  thin: WindowsLogoThin,
} as const

export const WindowsLogo = (props: IconProps) => {
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
