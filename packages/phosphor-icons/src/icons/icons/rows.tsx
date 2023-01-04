import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RowsBold } from '../bold/rows-bold'
import { RowsDuotone } from '../duotone/rows-duotone'
import { RowsFill } from '../fill/rows-fill'
import { RowsLight } from '../light/rows-light'
import { RowsRegular } from '../regular/rows-regular'
import { RowsThin } from '../thin/rows-thin'

const weightMap = {
  regular: RowsRegular,
  bold: RowsBold,
  duotone: RowsDuotone,
  fill: RowsFill,
  light: RowsLight,
  thin: RowsThin,
} as const

export const Rows = (props: IconProps) => {
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
