import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SpeakerLowBold } from '../bold/speaker-low-bold'
import { SpeakerLowDuotone } from '../duotone/speaker-low-duotone'
import { SpeakerLowFill } from '../fill/speaker-low-fill'
import { SpeakerLowLight } from '../light/speaker-low-light'
import { SpeakerLowRegular } from '../regular/speaker-low-regular'
import { SpeakerLowThin } from '../thin/speaker-low-thin'

const weightMap = {
  regular: SpeakerLowRegular,
  bold: SpeakerLowBold,
  duotone: SpeakerLowDuotone,
  fill: SpeakerLowFill,
  light: SpeakerLowLight,
  thin: SpeakerLowThin,
} as const

export const SpeakerLow = (props: IconProps) => {
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
