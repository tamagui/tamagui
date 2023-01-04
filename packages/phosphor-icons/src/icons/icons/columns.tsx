import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ColumnsBold } from '../bold/columns-bold'
import { ColumnsDuotone } from '../duotone/columns-duotone'
import { ColumnsFill } from '../fill/columns-fill'
import { ColumnsLight } from '../light/columns-light'
import { ColumnsRegular } from '../regular/columns-regular'
import { ColumnsThin } from '../thin/columns-thin'

const weightMap = {
  regular: ColumnsRegular,
  bold: ColumnsBold,
  duotone: ColumnsDuotone,
  fill: ColumnsFill,
  light: ColumnsLight,
  thin: ColumnsThin,
} as const

export const Columns = (props: IconProps) => {
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
