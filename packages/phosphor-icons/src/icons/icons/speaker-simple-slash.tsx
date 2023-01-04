import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SpeakerSimpleSlashBold } from '../bold/speaker-simple-slash-bold'
import { SpeakerSimpleSlashDuotone } from '../duotone/speaker-simple-slash-duotone'
import { SpeakerSimpleSlashFill } from '../fill/speaker-simple-slash-fill'
import { SpeakerSimpleSlashLight } from '../light/speaker-simple-slash-light'
import { SpeakerSimpleSlashRegular } from '../regular/speaker-simple-slash-regular'
import { SpeakerSimpleSlashThin } from '../thin/speaker-simple-slash-thin'

const weightMap = {
  regular: SpeakerSimpleSlashRegular,
  bold: SpeakerSimpleSlashBold,
  duotone: SpeakerSimpleSlashDuotone,
  fill: SpeakerSimpleSlashFill,
  light: SpeakerSimpleSlashLight,
  thin: SpeakerSimpleSlashThin,
} as const

export const SpeakerSimpleSlash = (props: IconProps) => {
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
