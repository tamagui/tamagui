import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NotepadBold } from '../bold/notepad-bold'
import { NotepadDuotone } from '../duotone/notepad-duotone'
import { NotepadFill } from '../fill/notepad-fill'
import { NotepadLight } from '../light/notepad-light'
import { NotepadRegular } from '../regular/notepad-regular'
import { NotepadThin } from '../thin/notepad-thin'

const weightMap = {
  regular: NotepadRegular,
  bold: NotepadBold,
  duotone: NotepadDuotone,
  fill: NotepadFill,
  light: NotepadLight,
  thin: NotepadThin,
} as const

export const Notepad = (props: IconProps) => {
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
