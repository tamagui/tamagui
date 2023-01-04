import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CaretDoubleLeftBold } from '../bold/caret-double-left-bold'
import { CaretDoubleLeftDuotone } from '../duotone/caret-double-left-duotone'
import { CaretDoubleLeftFill } from '../fill/caret-double-left-fill'
import { CaretDoubleLeftLight } from '../light/caret-double-left-light'
import { CaretDoubleLeftRegular } from '../regular/caret-double-left-regular'
import { CaretDoubleLeftThin } from '../thin/caret-double-left-thin'

const weightMap = {
  regular: CaretDoubleLeftRegular,
  bold: CaretDoubleLeftBold,
  duotone: CaretDoubleLeftDuotone,
  fill: CaretDoubleLeftFill,
  light: CaretDoubleLeftLight,
  thin: CaretDoubleLeftThin,
} as const

export const CaretDoubleLeft = (props: IconProps) => {
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
