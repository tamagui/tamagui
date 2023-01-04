import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MusicNoteBold } from '../bold/music-note-bold'
import { MusicNoteDuotone } from '../duotone/music-note-duotone'
import { MusicNoteFill } from '../fill/music-note-fill'
import { MusicNoteLight } from '../light/music-note-light'
import { MusicNoteRegular } from '../regular/music-note-regular'
import { MusicNoteThin } from '../thin/music-note-thin'

const weightMap = {
  regular: MusicNoteRegular,
  bold: MusicNoteBold,
  duotone: MusicNoteDuotone,
  fill: MusicNoteFill,
  light: MusicNoteLight,
  thin: MusicNoteThin,
} as const

export const MusicNote = (props: IconProps) => {
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
