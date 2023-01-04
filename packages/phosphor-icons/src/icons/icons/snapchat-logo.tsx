import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SnapchatLogoBold } from '../bold/snapchat-logo-bold'
import { SnapchatLogoDuotone } from '../duotone/snapchat-logo-duotone'
import { SnapchatLogoFill } from '../fill/snapchat-logo-fill'
import { SnapchatLogoLight } from '../light/snapchat-logo-light'
import { SnapchatLogoRegular } from '../regular/snapchat-logo-regular'
import { SnapchatLogoThin } from '../thin/snapchat-logo-thin'

const weightMap = {
  regular: SnapchatLogoRegular,
  bold: SnapchatLogoBold,
  duotone: SnapchatLogoDuotone,
  fill: SnapchatLogoFill,
  light: SnapchatLogoLight,
  thin: SnapchatLogoThin,
} as const

export const SnapchatLogo = (props: IconProps) => {
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
