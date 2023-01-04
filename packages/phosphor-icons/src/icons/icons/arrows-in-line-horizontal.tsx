import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowsInLineHorizontalBold } from '../bold/arrows-in-line-horizontal-bold'
import { ArrowsInLineHorizontalDuotone } from '../duotone/arrows-in-line-horizontal-duotone'
import { ArrowsInLineHorizontalFill } from '../fill/arrows-in-line-horizontal-fill'
import { ArrowsInLineHorizontalLight } from '../light/arrows-in-line-horizontal-light'
import { ArrowsInLineHorizontalRegular } from '../regular/arrows-in-line-horizontal-regular'
import { ArrowsInLineHorizontalThin } from '../thin/arrows-in-line-horizontal-thin'

const weightMap = {
  regular: ArrowsInLineHorizontalRegular,
  bold: ArrowsInLineHorizontalBold,
  duotone: ArrowsInLineHorizontalDuotone,
  fill: ArrowsInLineHorizontalFill,
  light: ArrowsInLineHorizontalLight,
  thin: ArrowsInLineHorizontalThin,
} as const

export const ArrowsInLineHorizontal = (props: IconProps) => {
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
