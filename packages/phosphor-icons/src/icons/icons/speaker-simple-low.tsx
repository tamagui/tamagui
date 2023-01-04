import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SpeakerSimpleLowBold } from '../bold/speaker-simple-low-bold'
import { SpeakerSimpleLowDuotone } from '../duotone/speaker-simple-low-duotone'
import { SpeakerSimpleLowFill } from '../fill/speaker-simple-low-fill'
import { SpeakerSimpleLowLight } from '../light/speaker-simple-low-light'
import { SpeakerSimpleLowRegular } from '../regular/speaker-simple-low-regular'
import { SpeakerSimpleLowThin } from '../thin/speaker-simple-low-thin'

const weightMap = {
  regular: SpeakerSimpleLowRegular,
  bold: SpeakerSimpleLowBold,
  duotone: SpeakerSimpleLowDuotone,
  fill: SpeakerSimpleLowFill,
  light: SpeakerSimpleLowLight,
  thin: SpeakerSimpleLowThin,
} as const

export const SpeakerSimpleLow = (props: IconProps) => {
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
