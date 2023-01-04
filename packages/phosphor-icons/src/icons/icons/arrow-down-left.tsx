import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowDownLeftBold } from '../bold/arrow-down-left-bold'
import { ArrowDownLeftDuotone } from '../duotone/arrow-down-left-duotone'
import { ArrowDownLeftFill } from '../fill/arrow-down-left-fill'
import { ArrowDownLeftLight } from '../light/arrow-down-left-light'
import { ArrowDownLeftRegular } from '../regular/arrow-down-left-regular'
import { ArrowDownLeftThin } from '../thin/arrow-down-left-thin'

const weightMap = {
  regular: ArrowDownLeftRegular,
  bold: ArrowDownLeftBold,
  duotone: ArrowDownLeftDuotone,
  fill: ArrowDownLeftFill,
  light: ArrowDownLeftLight,
  thin: ArrowDownLeftThin,
} as const

export const ArrowDownLeft = (props: IconProps) => {
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
