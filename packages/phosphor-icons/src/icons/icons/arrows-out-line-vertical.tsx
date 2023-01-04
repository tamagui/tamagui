import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowsOutLineVerticalBold } from '../bold/arrows-out-line-vertical-bold'
import { ArrowsOutLineVerticalDuotone } from '../duotone/arrows-out-line-vertical-duotone'
import { ArrowsOutLineVerticalFill } from '../fill/arrows-out-line-vertical-fill'
import { ArrowsOutLineVerticalLight } from '../light/arrows-out-line-vertical-light'
import { ArrowsOutLineVerticalRegular } from '../regular/arrows-out-line-vertical-regular'
import { ArrowsOutLineVerticalThin } from '../thin/arrows-out-line-vertical-thin'

const weightMap = {
  regular: ArrowsOutLineVerticalRegular,
  bold: ArrowsOutLineVerticalBold,
  duotone: ArrowsOutLineVerticalDuotone,
  fill: ArrowsOutLineVerticalFill,
  light: ArrowsOutLineVerticalLight,
  thin: ArrowsOutLineVerticalThin,
} as const

export const ArrowsOutLineVertical = (props: IconProps) => {
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
