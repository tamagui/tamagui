import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CellSignalLowBold } from '../bold/cell-signal-low-bold'
import { CellSignalLowDuotone } from '../duotone/cell-signal-low-duotone'
import { CellSignalLowFill } from '../fill/cell-signal-low-fill'
import { CellSignalLowLight } from '../light/cell-signal-low-light'
import { CellSignalLowRegular } from '../regular/cell-signal-low-regular'
import { CellSignalLowThin } from '../thin/cell-signal-low-thin'

const weightMap = {
  regular: CellSignalLowRegular,
  bold: CellSignalLowBold,
  duotone: CellSignalLowDuotone,
  fill: CellSignalLowFill,
  light: CellSignalLowLight,
  thin: CellSignalLowThin,
} as const

export const CellSignalLow = (props: IconProps) => {
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
