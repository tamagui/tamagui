import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CaretDoubleRightBold } from '../bold/caret-double-right-bold'
import { CaretDoubleRightDuotone } from '../duotone/caret-double-right-duotone'
import { CaretDoubleRightFill } from '../fill/caret-double-right-fill'
import { CaretDoubleRightLight } from '../light/caret-double-right-light'
import { CaretDoubleRightRegular } from '../regular/caret-double-right-regular'
import { CaretDoubleRightThin } from '../thin/caret-double-right-thin'

const weightMap = {
  regular: CaretDoubleRightRegular,
  bold: CaretDoubleRightBold,
  duotone: CaretDoubleRightDuotone,
  fill: CaretDoubleRightFill,
  light: CaretDoubleRightLight,
  thin: CaretDoubleRightThin,
} as const

export const CaretDoubleRight = (props: IconProps) => {
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
