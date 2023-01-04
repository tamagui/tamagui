import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ClipboardBold } from '../bold/clipboard-bold'
import { ClipboardDuotone } from '../duotone/clipboard-duotone'
import { ClipboardFill } from '../fill/clipboard-fill'
import { ClipboardLight } from '../light/clipboard-light'
import { ClipboardRegular } from '../regular/clipboard-regular'
import { ClipboardThin } from '../thin/clipboard-thin'

const weightMap = {
  regular: ClipboardRegular,
  bold: ClipboardBold,
  duotone: ClipboardDuotone,
  fill: ClipboardFill,
  light: ClipboardLight,
  thin: ClipboardThin,
} as const

export const Clipboard = (props: IconProps) => {
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
