import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CellSignalNoneBold } from '../bold/cell-signal-none-bold'
import { CellSignalNoneDuotone } from '../duotone/cell-signal-none-duotone'
import { CellSignalNoneFill } from '../fill/cell-signal-none-fill'
import { CellSignalNoneLight } from '../light/cell-signal-none-light'
import { CellSignalNoneRegular } from '../regular/cell-signal-none-regular'
import { CellSignalNoneThin } from '../thin/cell-signal-none-thin'

const weightMap = {
  regular: CellSignalNoneRegular,
  bold: CellSignalNoneBold,
  duotone: CellSignalNoneDuotone,
  fill: CellSignalNoneFill,
  light: CellSignalNoneLight,
  thin: CellSignalNoneThin,
} as const

export const CellSignalNone = (props: IconProps) => {
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
