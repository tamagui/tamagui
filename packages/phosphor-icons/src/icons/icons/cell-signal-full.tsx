import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CellSignalFullBold } from '../bold/cell-signal-full-bold'
import { CellSignalFullDuotone } from '../duotone/cell-signal-full-duotone'
import { CellSignalFullFill } from '../fill/cell-signal-full-fill'
import { CellSignalFullLight } from '../light/cell-signal-full-light'
import { CellSignalFullRegular } from '../regular/cell-signal-full-regular'
import { CellSignalFullThin } from '../thin/cell-signal-full-thin'

const weightMap = {
  regular: CellSignalFullRegular,
  bold: CellSignalFullBold,
  duotone: CellSignalFullDuotone,
  fill: CellSignalFullFill,
  light: CellSignalFullLight,
  thin: CellSignalFullThin,
} as const

export const CellSignalFull = (props: IconProps) => {
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
