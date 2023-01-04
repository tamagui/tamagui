import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowLineDownBold } from '../bold/arrow-line-down-bold'
import { ArrowLineDownDuotone } from '../duotone/arrow-line-down-duotone'
import { ArrowLineDownFill } from '../fill/arrow-line-down-fill'
import { ArrowLineDownLight } from '../light/arrow-line-down-light'
import { ArrowLineDownRegular } from '../regular/arrow-line-down-regular'
import { ArrowLineDownThin } from '../thin/arrow-line-down-thin'

const weightMap = {
  regular: ArrowLineDownRegular,
  bold: ArrowLineDownBold,
  duotone: ArrowLineDownDuotone,
  fill: ArrowLineDownFill,
  light: ArrowLineDownLight,
  thin: ArrowLineDownThin,
} as const

export const ArrowLineDown = (props: IconProps) => {
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
