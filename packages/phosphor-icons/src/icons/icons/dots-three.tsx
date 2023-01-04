import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DotsThreeBold } from '../bold/dots-three-bold'
import { DotsThreeDuotone } from '../duotone/dots-three-duotone'
import { DotsThreeFill } from '../fill/dots-three-fill'
import { DotsThreeLight } from '../light/dots-three-light'
import { DotsThreeRegular } from '../regular/dots-three-regular'
import { DotsThreeThin } from '../thin/dots-three-thin'

const weightMap = {
  regular: DotsThreeRegular,
  bold: DotsThreeBold,
  duotone: DotsThreeDuotone,
  fill: DotsThreeFill,
  light: DotsThreeLight,
  thin: DotsThreeThin,
} as const

export const DotsThree = (props: IconProps) => {
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
