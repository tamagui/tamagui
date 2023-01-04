import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CaretDoubleUpBold } from '../bold/caret-double-up-bold'
import { CaretDoubleUpDuotone } from '../duotone/caret-double-up-duotone'
import { CaretDoubleUpFill } from '../fill/caret-double-up-fill'
import { CaretDoubleUpLight } from '../light/caret-double-up-light'
import { CaretDoubleUpRegular } from '../regular/caret-double-up-regular'
import { CaretDoubleUpThin } from '../thin/caret-double-up-thin'

const weightMap = {
  regular: CaretDoubleUpRegular,
  bold: CaretDoubleUpBold,
  duotone: CaretDoubleUpDuotone,
  fill: CaretDoubleUpFill,
  light: CaretDoubleUpLight,
  thin: CaretDoubleUpThin,
} as const

export const CaretDoubleUp = (props: IconProps) => {
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
