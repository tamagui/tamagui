import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SpeakerNoneBold } from '../bold/speaker-none-bold'
import { SpeakerNoneDuotone } from '../duotone/speaker-none-duotone'
import { SpeakerNoneFill } from '../fill/speaker-none-fill'
import { SpeakerNoneLight } from '../light/speaker-none-light'
import { SpeakerNoneRegular } from '../regular/speaker-none-regular'
import { SpeakerNoneThin } from '../thin/speaker-none-thin'

const weightMap = {
  regular: SpeakerNoneRegular,
  bold: SpeakerNoneBold,
  duotone: SpeakerNoneDuotone,
  fill: SpeakerNoneFill,
  light: SpeakerNoneLight,
  thin: SpeakerNoneThin,
} as const

export const SpeakerNone = (props: IconProps) => {
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
