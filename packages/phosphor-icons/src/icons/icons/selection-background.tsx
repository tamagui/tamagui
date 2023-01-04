import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SelectionBackgroundBold } from '../bold/selection-background-bold'
import { SelectionBackgroundDuotone } from '../duotone/selection-background-duotone'
import { SelectionBackgroundFill } from '../fill/selection-background-fill'
import { SelectionBackgroundLight } from '../light/selection-background-light'
import { SelectionBackgroundRegular } from '../regular/selection-background-regular'
import { SelectionBackgroundThin } from '../thin/selection-background-thin'

const weightMap = {
  regular: SelectionBackgroundRegular,
  bold: SelectionBackgroundBold,
  duotone: SelectionBackgroundDuotone,
  fill: SelectionBackgroundFill,
  light: SelectionBackgroundLight,
  thin: SelectionBackgroundThin,
} as const

export const SelectionBackground = (props: IconProps) => {
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
