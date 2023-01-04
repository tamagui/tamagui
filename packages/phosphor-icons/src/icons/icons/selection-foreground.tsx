import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SelectionForegroundBold } from '../bold/selection-foreground-bold'
import { SelectionForegroundDuotone } from '../duotone/selection-foreground-duotone'
import { SelectionForegroundFill } from '../fill/selection-foreground-fill'
import { SelectionForegroundLight } from '../light/selection-foreground-light'
import { SelectionForegroundRegular } from '../regular/selection-foreground-regular'
import { SelectionForegroundThin } from '../thin/selection-foreground-thin'

const weightMap = {
  regular: SelectionForegroundRegular,
  bold: SelectionForegroundBold,
  duotone: SelectionForegroundDuotone,
  fill: SelectionForegroundFill,
  light: SelectionForegroundLight,
  thin: SelectionForegroundThin,
} as const

export const SelectionForeground = (props: IconProps) => {
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
