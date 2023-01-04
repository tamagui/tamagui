import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowLineLeftBold } from '../bold/arrow-line-left-bold'
import { ArrowLineLeftDuotone } from '../duotone/arrow-line-left-duotone'
import { ArrowLineLeftFill } from '../fill/arrow-line-left-fill'
import { ArrowLineLeftLight } from '../light/arrow-line-left-light'
import { ArrowLineLeftRegular } from '../regular/arrow-line-left-regular'
import { ArrowLineLeftThin } from '../thin/arrow-line-left-thin'

const weightMap = {
  regular: ArrowLineLeftRegular,
  bold: ArrowLineLeftBold,
  duotone: ArrowLineLeftDuotone,
  fill: ArrowLineLeftFill,
  light: ArrowLineLeftLight,
  thin: ArrowLineLeftThin,
} as const

export const ArrowLineLeft = (props: IconProps) => {
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
