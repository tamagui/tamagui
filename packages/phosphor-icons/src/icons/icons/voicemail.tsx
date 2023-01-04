import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { VoicemailBold } from '../bold/voicemail-bold'
import { VoicemailDuotone } from '../duotone/voicemail-duotone'
import { VoicemailFill } from '../fill/voicemail-fill'
import { VoicemailLight } from '../light/voicemail-light'
import { VoicemailRegular } from '../regular/voicemail-regular'
import { VoicemailThin } from '../thin/voicemail-thin'

const weightMap = {
  regular: VoicemailRegular,
  bold: VoicemailBold,
  duotone: VoicemailDuotone,
  fill: VoicemailFill,
  light: VoicemailLight,
  thin: VoicemailThin,
} as const

export const Voicemail = (props: IconProps) => {
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
