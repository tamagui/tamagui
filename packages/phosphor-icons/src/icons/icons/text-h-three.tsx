import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TextHThreeBold } from '../bold/text-h-three-bold'
import { TextHThreeDuotone } from '../duotone/text-h-three-duotone'
import { TextHThreeFill } from '../fill/text-h-three-fill'
import { TextHThreeLight } from '../light/text-h-three-light'
import { TextHThreeRegular } from '../regular/text-h-three-regular'
import { TextHThreeThin } from '../thin/text-h-three-thin'

const weightMap = {
  regular: TextHThreeRegular,
  bold: TextHThreeBold,
  duotone: TextHThreeDuotone,
  fill: TextHThreeFill,
  light: TextHThreeLight,
  thin: TextHThreeThin,
} as const

export const TextHThree = (props: IconProps) => {
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
