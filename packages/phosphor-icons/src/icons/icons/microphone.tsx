import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MicrophoneBold } from '../bold/microphone-bold'
import { MicrophoneDuotone } from '../duotone/microphone-duotone'
import { MicrophoneFill } from '../fill/microphone-fill'
import { MicrophoneLight } from '../light/microphone-light'
import { MicrophoneRegular } from '../regular/microphone-regular'
import { MicrophoneThin } from '../thin/microphone-thin'

const weightMap = {
  regular: MicrophoneRegular,
  bold: MicrophoneBold,
  duotone: MicrophoneDuotone,
  fill: MicrophoneFill,
  light: MicrophoneLight,
  thin: MicrophoneThin,
} as const

export const Microphone = (props: IconProps) => {
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
