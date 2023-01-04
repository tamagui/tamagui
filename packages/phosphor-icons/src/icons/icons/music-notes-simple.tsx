import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MusicNotesSimpleBold } from '../bold/music-notes-simple-bold'
import { MusicNotesSimpleDuotone } from '../duotone/music-notes-simple-duotone'
import { MusicNotesSimpleFill } from '../fill/music-notes-simple-fill'
import { MusicNotesSimpleLight } from '../light/music-notes-simple-light'
import { MusicNotesSimpleRegular } from '../regular/music-notes-simple-regular'
import { MusicNotesSimpleThin } from '../thin/music-notes-simple-thin'

const weightMap = {
  regular: MusicNotesSimpleRegular,
  bold: MusicNotesSimpleBold,
  duotone: MusicNotesSimpleDuotone,
  fill: MusicNotesSimpleFill,
  light: MusicNotesSimpleLight,
  thin: MusicNotesSimpleThin,
} as const

export const MusicNotesSimple = (props: IconProps) => {
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
