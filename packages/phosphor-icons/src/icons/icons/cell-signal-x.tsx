import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CellSignalXBold } from '../bold/cell-signal-x-bold'
import { CellSignalXDuotone } from '../duotone/cell-signal-x-duotone'
import { CellSignalXFill } from '../fill/cell-signal-x-fill'
import { CellSignalXLight } from '../light/cell-signal-x-light'
import { CellSignalXRegular } from '../regular/cell-signal-x-regular'
import { CellSignalXThin } from '../thin/cell-signal-x-thin'

const weightMap = {
  regular: CellSignalXRegular,
  bold: CellSignalXBold,
  duotone: CellSignalXDuotone,
  fill: CellSignalXFill,
  light: CellSignalXLight,
  thin: CellSignalXThin,
} as const

export const CellSignalX = (props: IconProps) => {
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
