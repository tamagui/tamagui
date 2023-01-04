import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ClipboardTextBold } from '../bold/clipboard-text-bold'
import { ClipboardTextDuotone } from '../duotone/clipboard-text-duotone'
import { ClipboardTextFill } from '../fill/clipboard-text-fill'
import { ClipboardTextLight } from '../light/clipboard-text-light'
import { ClipboardTextRegular } from '../regular/clipboard-text-regular'
import { ClipboardTextThin } from '../thin/clipboard-text-thin'

const weightMap = {
  regular: ClipboardTextRegular,
  bold: ClipboardTextBold,
  duotone: ClipboardTextDuotone,
  fill: ClipboardTextFill,
  light: ClipboardTextLight,
  thin: ClipboardTextThin,
} as const

export const ClipboardText = (props: IconProps) => {
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
