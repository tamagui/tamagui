import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TextAlignLeftBold } from '../bold/text-align-left-bold'
import { TextAlignLeftDuotone } from '../duotone/text-align-left-duotone'
import { TextAlignLeftFill } from '../fill/text-align-left-fill'
import { TextAlignLeftLight } from '../light/text-align-left-light'
import { TextAlignLeftRegular } from '../regular/text-align-left-regular'
import { TextAlignLeftThin } from '../thin/text-align-left-thin'

const weightMap = {
  regular: TextAlignLeftRegular,
  bold: TextAlignLeftBold,
  duotone: TextAlignLeftDuotone,
  fill: TextAlignLeftFill,
  light: TextAlignLeftLight,
  thin: TextAlignLeftThin,
} as const

export const TextAlignLeft = (props: IconProps) => {
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
