import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CaretDoubleDownBold } from '../bold/caret-double-down-bold'
import { CaretDoubleDownDuotone } from '../duotone/caret-double-down-duotone'
import { CaretDoubleDownFill } from '../fill/caret-double-down-fill'
import { CaretDoubleDownLight } from '../light/caret-double-down-light'
import { CaretDoubleDownRegular } from '../regular/caret-double-down-regular'
import { CaretDoubleDownThin } from '../thin/caret-double-down-thin'

const weightMap = {
  regular: CaretDoubleDownRegular,
  bold: CaretDoubleDownBold,
  duotone: CaretDoubleDownDuotone,
  fill: CaretDoubleDownFill,
  light: CaretDoubleDownLight,
  thin: CaretDoubleDownThin,
} as const

export const CaretDoubleDown = (props: IconProps) => {
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
