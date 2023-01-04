import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SpeakerSimpleNoneBold } from '../bold/speaker-simple-none-bold'
import { SpeakerSimpleNoneDuotone } from '../duotone/speaker-simple-none-duotone'
import { SpeakerSimpleNoneFill } from '../fill/speaker-simple-none-fill'
import { SpeakerSimpleNoneLight } from '../light/speaker-simple-none-light'
import { SpeakerSimpleNoneRegular } from '../regular/speaker-simple-none-regular'
import { SpeakerSimpleNoneThin } from '../thin/speaker-simple-none-thin'

const weightMap = {
  regular: SpeakerSimpleNoneRegular,
  bold: SpeakerSimpleNoneBold,
  duotone: SpeakerSimpleNoneDuotone,
  fill: SpeakerSimpleNoneFill,
  light: SpeakerSimpleNoneLight,
  thin: SpeakerSimpleNoneThin,
} as const

export const SpeakerSimpleNone = (props: IconProps) => {
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
