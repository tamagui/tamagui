import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MusicNotesPlusBold } from '../bold/music-notes-plus-bold'
import { MusicNotesPlusDuotone } from '../duotone/music-notes-plus-duotone'
import { MusicNotesPlusFill } from '../fill/music-notes-plus-fill'
import { MusicNotesPlusLight } from '../light/music-notes-plus-light'
import { MusicNotesPlusRegular } from '../regular/music-notes-plus-regular'
import { MusicNotesPlusThin } from '../thin/music-notes-plus-thin'

const weightMap = {
  regular: MusicNotesPlusRegular,
  bold: MusicNotesPlusBold,
  duotone: MusicNotesPlusDuotone,
  fill: MusicNotesPlusFill,
  light: MusicNotesPlusLight,
  thin: MusicNotesPlusThin,
} as const

export const MusicNotesPlus = (props: IconProps) => {
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
