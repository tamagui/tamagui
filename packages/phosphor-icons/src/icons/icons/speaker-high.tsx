import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SpeakerHighBold } from '../bold/speaker-high-bold'
import { SpeakerHighDuotone } from '../duotone/speaker-high-duotone'
import { SpeakerHighFill } from '../fill/speaker-high-fill'
import { SpeakerHighLight } from '../light/speaker-high-light'
import { SpeakerHighRegular } from '../regular/speaker-high-regular'
import { SpeakerHighThin } from '../thin/speaker-high-thin'

const weightMap = {
  regular: SpeakerHighRegular,
  bold: SpeakerHighBold,
  duotone: SpeakerHighDuotone,
  fill: SpeakerHighFill,
  light: SpeakerHighLight,
  thin: SpeakerHighThin,
} as const

export const SpeakerHigh = (props: IconProps) => {
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
