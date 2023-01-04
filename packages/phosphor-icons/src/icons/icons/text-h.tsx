import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TextHBold } from '../bold/text-h-bold'
import { TextHDuotone } from '../duotone/text-h-duotone'
import { TextHFill } from '../fill/text-h-fill'
import { TextHLight } from '../light/text-h-light'
import { TextHRegular } from '../regular/text-h-regular'
import { TextHThin } from '../thin/text-h-thin'

const weightMap = {
  regular: TextHRegular,
  bold: TextHBold,
  duotone: TextHDuotone,
  fill: TextHFill,
  light: TextHLight,
  thin: TextHThin,
} as const

export const TextH = (props: IconProps) => {
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
