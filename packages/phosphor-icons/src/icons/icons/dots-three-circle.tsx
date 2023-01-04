import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DotsThreeCircleBold } from '../bold/dots-three-circle-bold'
import { DotsThreeCircleDuotone } from '../duotone/dots-three-circle-duotone'
import { DotsThreeCircleFill } from '../fill/dots-three-circle-fill'
import { DotsThreeCircleLight } from '../light/dots-three-circle-light'
import { DotsThreeCircleRegular } from '../regular/dots-three-circle-regular'
import { DotsThreeCircleThin } from '../thin/dots-three-circle-thin'

const weightMap = {
  regular: DotsThreeCircleRegular,
  bold: DotsThreeCircleBold,
  duotone: DotsThreeCircleDuotone,
  fill: DotsThreeCircleFill,
  light: DotsThreeCircleLight,
  thin: DotsThreeCircleThin,
} as const

export const DotsThreeCircle = (props: IconProps) => {
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
