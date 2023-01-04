import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DotsThreeVerticalBold } from '../bold/dots-three-vertical-bold'
import { DotsThreeVerticalDuotone } from '../duotone/dots-three-vertical-duotone'
import { DotsThreeVerticalFill } from '../fill/dots-three-vertical-fill'
import { DotsThreeVerticalLight } from '../light/dots-three-vertical-light'
import { DotsThreeVerticalRegular } from '../regular/dots-three-vertical-regular'
import { DotsThreeVerticalThin } from '../thin/dots-three-vertical-thin'

const weightMap = {
  regular: DotsThreeVerticalRegular,
  bold: DotsThreeVerticalBold,
  duotone: DotsThreeVerticalDuotone,
  fill: DotsThreeVerticalFill,
  light: DotsThreeVerticalLight,
  thin: DotsThreeVerticalThin,
} as const

export const DotsThreeVertical = (props: IconProps) => {
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
