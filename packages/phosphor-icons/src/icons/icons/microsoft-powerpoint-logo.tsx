import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MicrosoftPowerpointLogoBold } from '../bold/microsoft-powerpoint-logo-bold'
import { MicrosoftPowerpointLogoDuotone } from '../duotone/microsoft-powerpoint-logo-duotone'
import { MicrosoftPowerpointLogoFill } from '../fill/microsoft-powerpoint-logo-fill'
import { MicrosoftPowerpointLogoLight } from '../light/microsoft-powerpoint-logo-light'
import { MicrosoftPowerpointLogoRegular } from '../regular/microsoft-powerpoint-logo-regular'
import { MicrosoftPowerpointLogoThin } from '../thin/microsoft-powerpoint-logo-thin'

const weightMap = {
  regular: MicrosoftPowerpointLogoRegular,
  bold: MicrosoftPowerpointLogoBold,
  duotone: MicrosoftPowerpointLogoDuotone,
  fill: MicrosoftPowerpointLogoFill,
  light: MicrosoftPowerpointLogoLight,
  thin: MicrosoftPowerpointLogoThin,
} as const

export const MicrosoftPowerpointLogo = (props: IconProps) => {
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
