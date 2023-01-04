import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DotsThreeOutlineBold } from '../bold/dots-three-outline-bold'
import { DotsThreeOutlineDuotone } from '../duotone/dots-three-outline-duotone'
import { DotsThreeOutlineFill } from '../fill/dots-three-outline-fill'
import { DotsThreeOutlineLight } from '../light/dots-three-outline-light'
import { DotsThreeOutlineRegular } from '../regular/dots-three-outline-regular'
import { DotsThreeOutlineThin } from '../thin/dots-three-outline-thin'

const weightMap = {
  regular: DotsThreeOutlineRegular,
  bold: DotsThreeOutlineBold,
  duotone: DotsThreeOutlineDuotone,
  fill: DotsThreeOutlineFill,
  light: DotsThreeOutlineLight,
  thin: DotsThreeOutlineThin,
} as const

export const DotsThreeOutline = (props: IconProps) => {
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
