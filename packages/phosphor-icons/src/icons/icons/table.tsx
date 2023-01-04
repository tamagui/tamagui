import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TableBold } from '../bold/table-bold'
import { TableDuotone } from '../duotone/table-duotone'
import { TableFill } from '../fill/table-fill'
import { TableLight } from '../light/table-light'
import { TableRegular } from '../regular/table-regular'
import { TableThin } from '../thin/table-thin'

const weightMap = {
  regular: TableRegular,
  bold: TableBold,
  duotone: TableDuotone,
  fill: TableFill,
  light: TableLight,
  thin: TableThin,
} as const

export const Table = (props: IconProps) => {
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
