import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MicrosoftTeamsLogoBold } from '../bold/microsoft-teams-logo-bold'
import { MicrosoftTeamsLogoDuotone } from '../duotone/microsoft-teams-logo-duotone'
import { MicrosoftTeamsLogoFill } from '../fill/microsoft-teams-logo-fill'
import { MicrosoftTeamsLogoLight } from '../light/microsoft-teams-logo-light'
import { MicrosoftTeamsLogoRegular } from '../regular/microsoft-teams-logo-regular'
import { MicrosoftTeamsLogoThin } from '../thin/microsoft-teams-logo-thin'

const weightMap = {
  regular: MicrosoftTeamsLogoRegular,
  bold: MicrosoftTeamsLogoBold,
  duotone: MicrosoftTeamsLogoDuotone,
  fill: MicrosoftTeamsLogoFill,
  light: MicrosoftTeamsLogoLight,
  thin: MicrosoftTeamsLogoThin,
} as const

export const MicrosoftTeamsLogo = (props: IconProps) => {
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
