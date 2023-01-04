import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SelectionSlashBold } from '../bold/selection-slash-bold'
import { SelectionSlashDuotone } from '../duotone/selection-slash-duotone'
import { SelectionSlashFill } from '../fill/selection-slash-fill'
import { SelectionSlashLight } from '../light/selection-slash-light'
import { SelectionSlashRegular } from '../regular/selection-slash-regular'
import { SelectionSlashThin } from '../thin/selection-slash-thin'

const weightMap = {
  regular: SelectionSlashRegular,
  bold: SelectionSlashBold,
  duotone: SelectionSlashDuotone,
  fill: SelectionSlashFill,
  light: SelectionSlashLight,
  thin: SelectionSlashThin,
} as const

export const SelectionSlash = (props: IconProps) => {
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
