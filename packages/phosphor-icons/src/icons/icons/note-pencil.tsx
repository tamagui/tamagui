import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NotePencilBold } from '../bold/note-pencil-bold'
import { NotePencilDuotone } from '../duotone/note-pencil-duotone'
import { NotePencilFill } from '../fill/note-pencil-fill'
import { NotePencilLight } from '../light/note-pencil-light'
import { NotePencilRegular } from '../regular/note-pencil-regular'
import { NotePencilThin } from '../thin/note-pencil-thin'

const weightMap = {
  regular: NotePencilRegular,
  bold: NotePencilBold,
  duotone: NotePencilDuotone,
  fill: NotePencilFill,
  light: NotePencilLight,
  thin: NotePencilThin,
} as const

export const NotePencil = (props: IconProps) => {
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
