import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MusicNoteSimpleBold } from '../bold/music-note-simple-bold'
import { MusicNoteSimpleDuotone } from '../duotone/music-note-simple-duotone'
import { MusicNoteSimpleFill } from '../fill/music-note-simple-fill'
import { MusicNoteSimpleLight } from '../light/music-note-simple-light'
import { MusicNoteSimpleRegular } from '../regular/music-note-simple-regular'
import { MusicNoteSimpleThin } from '../thin/music-note-simple-thin'

const weightMap = {
  regular: MusicNoteSimpleRegular,
  bold: MusicNoteSimpleBold,
  duotone: MusicNoteSimpleDuotone,
  fill: MusicNoteSimpleFill,
  light: MusicNoteSimpleLight,
  thin: MusicNoteSimpleThin,
} as const

export const MusicNoteSimple = (props: IconProps) => {
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
