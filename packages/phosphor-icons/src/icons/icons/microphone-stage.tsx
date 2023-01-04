import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MicrophoneStageBold } from '../bold/microphone-stage-bold'
import { MicrophoneStageDuotone } from '../duotone/microphone-stage-duotone'
import { MicrophoneStageFill } from '../fill/microphone-stage-fill'
import { MicrophoneStageLight } from '../light/microphone-stage-light'
import { MicrophoneStageRegular } from '../regular/microphone-stage-regular'
import { MicrophoneStageThin } from '../thin/microphone-stage-thin'

const weightMap = {
  regular: MicrophoneStageRegular,
  bold: MicrophoneStageBold,
  duotone: MicrophoneStageDuotone,
  fill: MicrophoneStageFill,
  light: MicrophoneStageLight,
  thin: MicrophoneStageThin,
} as const

export const MicrophoneStage = (props: IconProps) => {
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
