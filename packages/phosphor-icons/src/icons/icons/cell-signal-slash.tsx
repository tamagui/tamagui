import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CellSignalSlashBold } from '../bold/cell-signal-slash-bold'
import { CellSignalSlashDuotone } from '../duotone/cell-signal-slash-duotone'
import { CellSignalSlashFill } from '../fill/cell-signal-slash-fill'
import { CellSignalSlashLight } from '../light/cell-signal-slash-light'
import { CellSignalSlashRegular } from '../regular/cell-signal-slash-regular'
import { CellSignalSlashThin } from '../thin/cell-signal-slash-thin'

const weightMap = {
  regular: CellSignalSlashRegular,
  bold: CellSignalSlashBold,
  duotone: CellSignalSlashDuotone,
  fill: CellSignalSlashFill,
  light: CellSignalSlashLight,
  thin: CellSignalSlashThin,
} as const

export const CellSignalSlash = (props: IconProps) => {
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
