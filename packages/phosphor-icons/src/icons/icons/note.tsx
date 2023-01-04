import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NoteBold } from '../bold/note-bold'
import { NoteDuotone } from '../duotone/note-duotone'
import { NoteFill } from '../fill/note-fill'
import { NoteLight } from '../light/note-light'
import { NoteRegular } from '../regular/note-regular'
import { NoteThin } from '../thin/note-thin'

const weightMap = {
  regular: NoteRegular,
  bold: NoteBold,
  duotone: NoteDuotone,
  fill: NoteFill,
  light: NoteLight,
  thin: NoteThin,
} as const

export const Note = (props: IconProps) => {
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
