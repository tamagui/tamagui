import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TextUnderlineBold } from '../bold/text-underline-bold'
import { TextUnderlineDuotone } from '../duotone/text-underline-duotone'
import { TextUnderlineFill } from '../fill/text-underline-fill'
import { TextUnderlineLight } from '../light/text-underline-light'
import { TextUnderlineRegular } from '../regular/text-underline-regular'
import { TextUnderlineThin } from '../thin/text-underline-thin'

const weightMap = {
  regular: TextUnderlineRegular,
  bold: TextUnderlineBold,
  duotone: TextUnderlineDuotone,
  fill: TextUnderlineFill,
  light: TextUnderlineLight,
  thin: TextUnderlineThin,
} as const

export const TextUnderline = (props: IconProps) => {
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
