import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NoteBlankBold } from '../bold/note-blank-bold'
import { NoteBlankDuotone } from '../duotone/note-blank-duotone'
import { NoteBlankFill } from '../fill/note-blank-fill'
import { NoteBlankLight } from '../light/note-blank-light'
import { NoteBlankRegular } from '../regular/note-blank-regular'
import { NoteBlankThin } from '../thin/note-blank-thin'

const weightMap = {
  regular: NoteBlankRegular,
  bold: NoteBlankBold,
  duotone: NoteBlankDuotone,
  fill: NoteBlankFill,
  light: NoteBlankLight,
  thin: NoteBlankThin,
} as const

export const NoteBlank = (props: IconProps) => {
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
