import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SpeakerSlashBold } from '../bold/speaker-slash-bold'
import { SpeakerSlashDuotone } from '../duotone/speaker-slash-duotone'
import { SpeakerSlashFill } from '../fill/speaker-slash-fill'
import { SpeakerSlashLight } from '../light/speaker-slash-light'
import { SpeakerSlashRegular } from '../regular/speaker-slash-regular'
import { SpeakerSlashThin } from '../thin/speaker-slash-thin'

const weightMap = {
  regular: SpeakerSlashRegular,
  bold: SpeakerSlashBold,
  duotone: SpeakerSlashDuotone,
  fill: SpeakerSlashFill,
  light: SpeakerSlashLight,
  thin: SpeakerSlashThin,
} as const

export const SpeakerSlash = (props: IconProps) => {
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
