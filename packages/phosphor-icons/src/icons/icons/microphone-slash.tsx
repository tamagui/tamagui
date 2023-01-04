import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MicrophoneSlashBold } from '../bold/microphone-slash-bold'
import { MicrophoneSlashDuotone } from '../duotone/microphone-slash-duotone'
import { MicrophoneSlashFill } from '../fill/microphone-slash-fill'
import { MicrophoneSlashLight } from '../light/microphone-slash-light'
import { MicrophoneSlashRegular } from '../regular/microphone-slash-regular'
import { MicrophoneSlashThin } from '../thin/microphone-slash-thin'

const weightMap = {
  regular: MicrophoneSlashRegular,
  bold: MicrophoneSlashBold,
  duotone: MicrophoneSlashDuotone,
  fill: MicrophoneSlashFill,
  light: MicrophoneSlashLight,
  thin: MicrophoneSlashThin,
} as const

export const MicrophoneSlash = (props: IconProps) => {
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
