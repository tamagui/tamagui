import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CellSignalMediumBold } from '../bold/cell-signal-medium-bold'
import { CellSignalMediumDuotone } from '../duotone/cell-signal-medium-duotone'
import { CellSignalMediumFill } from '../fill/cell-signal-medium-fill'
import { CellSignalMediumLight } from '../light/cell-signal-medium-light'
import { CellSignalMediumRegular } from '../regular/cell-signal-medium-regular'
import { CellSignalMediumThin } from '../thin/cell-signal-medium-thin'

const weightMap = {
  regular: CellSignalMediumRegular,
  bold: CellSignalMediumBold,
  duotone: CellSignalMediumDuotone,
  fill: CellSignalMediumFill,
  light: CellSignalMediumLight,
  thin: CellSignalMediumThin,
} as const

export const CellSignalMedium = (props: IconProps) => {
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
