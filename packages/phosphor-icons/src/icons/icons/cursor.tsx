import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CursorBold } from '../bold/cursor-bold'
import { CursorDuotone } from '../duotone/cursor-duotone'
import { CursorFill } from '../fill/cursor-fill'
import { CursorLight } from '../light/cursor-light'
import { CursorRegular } from '../regular/cursor-regular'
import { CursorThin } from '../thin/cursor-thin'

const weightMap = {
  regular: CursorRegular,
  bold: CursorBold,
  duotone: CursorDuotone,
  fill: CursorFill,
  light: CursorLight,
  thin: CursorThin,
} as const

export const Cursor = (props: IconProps) => {
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
