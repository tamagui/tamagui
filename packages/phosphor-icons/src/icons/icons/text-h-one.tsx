import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TextHOneBold } from '../bold/text-h-one-bold'
import { TextHOneDuotone } from '../duotone/text-h-one-duotone'
import { TextHOneFill } from '../fill/text-h-one-fill'
import { TextHOneLight } from '../light/text-h-one-light'
import { TextHOneRegular } from '../regular/text-h-one-regular'
import { TextHOneThin } from '../thin/text-h-one-thin'

const weightMap = {
  regular: TextHOneRegular,
  bold: TextHOneBold,
  duotone: TextHOneDuotone,
  fill: TextHOneFill,
  light: TextHOneLight,
  thin: TextHOneThin,
} as const

export const TextHOne = (props: IconProps) => {
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
