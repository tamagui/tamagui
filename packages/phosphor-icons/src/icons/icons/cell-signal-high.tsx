import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CellSignalHighBold } from '../bold/cell-signal-high-bold'
import { CellSignalHighDuotone } from '../duotone/cell-signal-high-duotone'
import { CellSignalHighFill } from '../fill/cell-signal-high-fill'
import { CellSignalHighLight } from '../light/cell-signal-high-light'
import { CellSignalHighRegular } from '../regular/cell-signal-high-regular'
import { CellSignalHighThin } from '../thin/cell-signal-high-thin'

const weightMap = {
  regular: CellSignalHighRegular,
  bold: CellSignalHighBold,
  duotone: CellSignalHighDuotone,
  fill: CellSignalHighFill,
  light: CellSignalHighLight,
  thin: CellSignalHighThin,
} as const

export const CellSignalHigh = (props: IconProps) => {
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
