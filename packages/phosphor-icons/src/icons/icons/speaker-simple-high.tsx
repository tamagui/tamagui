import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SpeakerSimpleHighBold } from '../bold/speaker-simple-high-bold'
import { SpeakerSimpleHighDuotone } from '../duotone/speaker-simple-high-duotone'
import { SpeakerSimpleHighFill } from '../fill/speaker-simple-high-fill'
import { SpeakerSimpleHighLight } from '../light/speaker-simple-high-light'
import { SpeakerSimpleHighRegular } from '../regular/speaker-simple-high-regular'
import { SpeakerSimpleHighThin } from '../thin/speaker-simple-high-thin'

const weightMap = {
  regular: SpeakerSimpleHighRegular,
  bold: SpeakerSimpleHighBold,
  duotone: SpeakerSimpleHighDuotone,
  fill: SpeakerSimpleHighFill,
  light: SpeakerSimpleHighLight,
  thin: SpeakerSimpleHighThin,
} as const

export const SpeakerSimpleHigh = (props: IconProps) => {
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
