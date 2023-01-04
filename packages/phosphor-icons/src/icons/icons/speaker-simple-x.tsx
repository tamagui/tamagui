import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SpeakerSimpleXBold } from '../bold/speaker-simple-x-bold'
import { SpeakerSimpleXDuotone } from '../duotone/speaker-simple-x-duotone'
import { SpeakerSimpleXFill } from '../fill/speaker-simple-x-fill'
import { SpeakerSimpleXLight } from '../light/speaker-simple-x-light'
import { SpeakerSimpleXRegular } from '../regular/speaker-simple-x-regular'
import { SpeakerSimpleXThin } from '../thin/speaker-simple-x-thin'

const weightMap = {
  regular: SpeakerSimpleXRegular,
  bold: SpeakerSimpleXBold,
  duotone: SpeakerSimpleXDuotone,
  fill: SpeakerSimpleXFill,
  light: SpeakerSimpleXLight,
  thin: SpeakerSimpleXThin,
} as const

export const SpeakerSimpleX = (props: IconProps) => {
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
