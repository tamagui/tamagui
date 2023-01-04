import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DotsThreeCircleVerticalBold } from '../bold/dots-three-circle-vertical-bold'
import { DotsThreeCircleVerticalDuotone } from '../duotone/dots-three-circle-vertical-duotone'
import { DotsThreeCircleVerticalFill } from '../fill/dots-three-circle-vertical-fill'
import { DotsThreeCircleVerticalLight } from '../light/dots-three-circle-vertical-light'
import { DotsThreeCircleVerticalRegular } from '../regular/dots-three-circle-vertical-regular'
import { DotsThreeCircleVerticalThin } from '../thin/dots-three-circle-vertical-thin'

const weightMap = {
  regular: DotsThreeCircleVerticalRegular,
  bold: DotsThreeCircleVerticalBold,
  duotone: DotsThreeCircleVerticalDuotone,
  fill: DotsThreeCircleVerticalFill,
  light: DotsThreeCircleVerticalLight,
  thin: DotsThreeCircleVerticalThin,
} as const

export const DotsThreeCircleVertical = (props: IconProps) => {
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
