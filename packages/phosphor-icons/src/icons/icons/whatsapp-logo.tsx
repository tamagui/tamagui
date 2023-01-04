import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WhatsappLogoBold } from '../bold/whatsapp-logo-bold'
import { WhatsappLogoDuotone } from '../duotone/whatsapp-logo-duotone'
import { WhatsappLogoFill } from '../fill/whatsapp-logo-fill'
import { WhatsappLogoLight } from '../light/whatsapp-logo-light'
import { WhatsappLogoRegular } from '../regular/whatsapp-logo-regular'
import { WhatsappLogoThin } from '../thin/whatsapp-logo-thin'

const weightMap = {
  regular: WhatsappLogoRegular,
  bold: WhatsappLogoBold,
  duotone: WhatsappLogoDuotone,
  fill: WhatsappLogoFill,
  light: WhatsappLogoLight,
  thin: WhatsappLogoThin,
} as const

export const WhatsappLogo = (props: IconProps) => {
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
