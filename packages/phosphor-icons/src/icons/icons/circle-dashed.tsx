import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CircleDashedBold } from '../bold/circle-dashed-bold'
import { CircleDashedDuotone } from '../duotone/circle-dashed-duotone'
import { CircleDashedFill } from '../fill/circle-dashed-fill'
import { CircleDashedLight } from '../light/circle-dashed-light'
import { CircleDashedRegular } from '../regular/circle-dashed-regular'
import { CircleDashedThin } from '../thin/circle-dashed-thin'

const weightMap = {
  regular: CircleDashedRegular,
  bold: CircleDashedBold,
  duotone: CircleDashedDuotone,
  fill: CircleDashedFill,
  light: CircleDashedLight,
  thin: CircleDashedThin,
} as const

export const CircleDashed = (props: IconProps) => {
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
