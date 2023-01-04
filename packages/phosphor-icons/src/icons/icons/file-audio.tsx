import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileAudioBold } from '../bold/file-audio-bold'
import { FileAudioDuotone } from '../duotone/file-audio-duotone'
import { FileAudioFill } from '../fill/file-audio-fill'
import { FileAudioLight } from '../light/file-audio-light'
import { FileAudioRegular } from '../regular/file-audio-regular'
import { FileAudioThin } from '../thin/file-audio-thin'

const weightMap = {
  regular: FileAudioRegular,
  bold: FileAudioBold,
  duotone: FileAudioDuotone,
  fill: FileAudioFill,
  light: FileAudioLight,
  thin: FileAudioThin,
} as const

export const FileAudio = (props: IconProps) => {
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
