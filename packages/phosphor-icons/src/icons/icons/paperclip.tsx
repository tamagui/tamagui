import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PaperclipBold } from '../bold/paperclip-bold'
import { PaperclipDuotone } from '../duotone/paperclip-duotone'
import { PaperclipFill } from '../fill/paperclip-fill'
import { PaperclipLight } from '../light/paperclip-light'
import { PaperclipRegular } from '../regular/paperclip-regular'
import { PaperclipThin } from '../thin/paperclip-thin'

const weightMap = {
  regular: PaperclipRegular,
  bold: PaperclipBold,
  duotone: PaperclipDuotone,
  fill: PaperclipFill,
  light: PaperclipLight,
  thin: PaperclipThin,
} as const

export const Paperclip = (props: IconProps) => {
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
