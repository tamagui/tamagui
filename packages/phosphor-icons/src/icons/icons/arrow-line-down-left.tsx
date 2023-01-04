import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowLineDownLeftBold } from '../bold/arrow-line-down-left-bold'
import { ArrowLineDownLeftDuotone } from '../duotone/arrow-line-down-left-duotone'
import { ArrowLineDownLeftFill } from '../fill/arrow-line-down-left-fill'
import { ArrowLineDownLeftLight } from '../light/arrow-line-down-left-light'
import { ArrowLineDownLeftRegular } from '../regular/arrow-line-down-left-regular'
import { ArrowLineDownLeftThin } from '../thin/arrow-line-down-left-thin'

const weightMap = {
  regular: ArrowLineDownLeftRegular,
  bold: ArrowLineDownLeftBold,
  duotone: ArrowLineDownLeftDuotone,
  fill: ArrowLineDownLeftFill,
  light: ArrowLineDownLeftLight,
  thin: ArrowLineDownLeftThin,
} as const

export const ArrowLineDownLeft = (props: IconProps) => {
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
