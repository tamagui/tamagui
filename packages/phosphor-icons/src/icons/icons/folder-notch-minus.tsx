import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FolderNotchMinusBold } from '../bold/folder-notch-minus-bold'
import { FolderNotchMinusDuotone } from '../duotone/folder-notch-minus-duotone'
import { FolderNotchMinusFill } from '../fill/folder-notch-minus-fill'
import { FolderNotchMinusLight } from '../light/folder-notch-minus-light'
import { FolderNotchMinusRegular } from '../regular/folder-notch-minus-regular'
import { FolderNotchMinusThin } from '../thin/folder-notch-minus-thin'

const weightMap = {
  regular: FolderNotchMinusRegular,
  bold: FolderNotchMinusBold,
  duotone: FolderNotchMinusDuotone,
  fill: FolderNotchMinusFill,
  light: FolderNotchMinusLight,
  thin: FolderNotchMinusThin,
} as const

export const FolderNotchMinus = (props: IconProps) => {
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
