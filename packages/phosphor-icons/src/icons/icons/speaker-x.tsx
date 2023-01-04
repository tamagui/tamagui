import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SpeakerXBold } from '../bold/speaker-x-bold'
import { SpeakerXDuotone } from '../duotone/speaker-x-duotone'
import { SpeakerXFill } from '../fill/speaker-x-fill'
import { SpeakerXLight } from '../light/speaker-x-light'
import { SpeakerXRegular } from '../regular/speaker-x-regular'
import { SpeakerXThin } from '../thin/speaker-x-thin'

const weightMap = {
  regular: SpeakerXRegular,
  bold: SpeakerXBold,
  duotone: SpeakerXDuotone,
  fill: SpeakerXFill,
  light: SpeakerXLight,
  thin: SpeakerXThin,
} as const

export const SpeakerX = (props: IconProps) => {
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
