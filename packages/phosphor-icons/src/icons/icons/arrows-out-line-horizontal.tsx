import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowsOutLineHorizontalBold } from '../bold/arrows-out-line-horizontal-bold'
import { ArrowsOutLineHorizontalDuotone } from '../duotone/arrows-out-line-horizontal-duotone'
import { ArrowsOutLineHorizontalFill } from '../fill/arrows-out-line-horizontal-fill'
import { ArrowsOutLineHorizontalLight } from '../light/arrows-out-line-horizontal-light'
import { ArrowsOutLineHorizontalRegular } from '../regular/arrows-out-line-horizontal-regular'
import { ArrowsOutLineHorizontalThin } from '../thin/arrows-out-line-horizontal-thin'

const weightMap = {
  regular: ArrowsOutLineHorizontalRegular,
  bold: ArrowsOutLineHorizontalBold,
  duotone: ArrowsOutLineHorizontalDuotone,
  fill: ArrowsOutLineHorizontalFill,
  light: ArrowsOutLineHorizontalLight,
  thin: ArrowsOutLineHorizontalThin,
} as const

export const ArrowsOutLineHorizontal = (props: IconProps) => {
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
