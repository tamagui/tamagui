import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CursorTextBold } from '../bold/cursor-text-bold'
import { CursorTextDuotone } from '../duotone/cursor-text-duotone'
import { CursorTextFill } from '../fill/cursor-text-fill'
import { CursorTextLight } from '../light/cursor-text-light'
import { CursorTextRegular } from '../regular/cursor-text-regular'
import { CursorTextThin } from '../thin/cursor-text-thin'

const weightMap = {
  regular: CursorTextRegular,
  bold: CursorTextBold,
  duotone: CursorTextDuotone,
  fill: CursorTextFill,
  light: CursorTextLight,
  thin: CursorTextThin,
} as const

export const CursorText = (props: IconProps) => {
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
