import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PaperclipHorizontalBold } from '../bold/paperclip-horizontal-bold'
import { PaperclipHorizontalDuotone } from '../duotone/paperclip-horizontal-duotone'
import { PaperclipHorizontalFill } from '../fill/paperclip-horizontal-fill'
import { PaperclipHorizontalLight } from '../light/paperclip-horizontal-light'
import { PaperclipHorizontalRegular } from '../regular/paperclip-horizontal-regular'
import { PaperclipHorizontalThin } from '../thin/paperclip-horizontal-thin'

const weightMap = {
  regular: PaperclipHorizontalRegular,
  bold: PaperclipHorizontalBold,
  duotone: PaperclipHorizontalDuotone,
  fill: PaperclipHorizontalFill,
  light: PaperclipHorizontalLight,
  thin: PaperclipHorizontalThin,
} as const

export const PaperclipHorizontal = (props: IconProps) => {
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
