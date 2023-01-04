import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MusicNotesBold } from '../bold/music-notes-bold'
import { MusicNotesDuotone } from '../duotone/music-notes-duotone'
import { MusicNotesFill } from '../fill/music-notes-fill'
import { MusicNotesLight } from '../light/music-notes-light'
import { MusicNotesRegular } from '../regular/music-notes-regular'
import { MusicNotesThin } from '../thin/music-notes-thin'

const weightMap = {
  regular: MusicNotesRegular,
  bold: MusicNotesBold,
  duotone: MusicNotesDuotone,
  fill: MusicNotesFill,
  light: MusicNotesLight,
  thin: MusicNotesThin,
} as const

export const MusicNotes = (props: IconProps) => {
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
