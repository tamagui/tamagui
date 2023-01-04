import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MicrosoftWordLogoBold } from '../bold/microsoft-word-logo-bold'
import { MicrosoftWordLogoDuotone } from '../duotone/microsoft-word-logo-duotone'
import { MicrosoftWordLogoFill } from '../fill/microsoft-word-logo-fill'
import { MicrosoftWordLogoLight } from '../light/microsoft-word-logo-light'
import { MicrosoftWordLogoRegular } from '../regular/microsoft-word-logo-regular'
import { MicrosoftWordLogoThin } from '../thin/microsoft-word-logo-thin'

const weightMap = {
  regular: MicrosoftWordLogoRegular,
  bold: MicrosoftWordLogoBold,
  duotone: MicrosoftWordLogoDuotone,
  fill: MicrosoftWordLogoFill,
  light: MicrosoftWordLogoLight,
  thin: MicrosoftWordLogoThin,
} as const

export const MicrosoftWordLogo = (props: IconProps) => {
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
