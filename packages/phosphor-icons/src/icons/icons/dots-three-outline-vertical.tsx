import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DotsThreeOutlineVerticalBold } from '../bold/dots-three-outline-vertical-bold'
import { DotsThreeOutlineVerticalDuotone } from '../duotone/dots-three-outline-vertical-duotone'
import { DotsThreeOutlineVerticalFill } from '../fill/dots-three-outline-vertical-fill'
import { DotsThreeOutlineVerticalLight } from '../light/dots-three-outline-vertical-light'
import { DotsThreeOutlineVerticalRegular } from '../regular/dots-three-outline-vertical-regular'
import { DotsThreeOutlineVerticalThin } from '../thin/dots-three-outline-vertical-thin'

const weightMap = {
  regular: DotsThreeOutlineVerticalRegular,
  bold: DotsThreeOutlineVerticalBold,
  duotone: DotsThreeOutlineVerticalDuotone,
  fill: DotsThreeOutlineVerticalFill,
  light: DotsThreeOutlineVerticalLight,
  thin: DotsThreeOutlineVerticalThin,
} as const

export const DotsThreeOutlineVertical = (props: IconProps) => {
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
