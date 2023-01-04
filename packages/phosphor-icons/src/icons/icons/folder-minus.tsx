import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FolderMinusBold } from '../bold/folder-minus-bold'
import { FolderMinusDuotone } from '../duotone/folder-minus-duotone'
import { FolderMinusFill } from '../fill/folder-minus-fill'
import { FolderMinusLight } from '../light/folder-minus-light'
import { FolderMinusRegular } from '../regular/folder-minus-regular'
import { FolderMinusThin } from '../thin/folder-minus-thin'

const weightMap = {
  regular: FolderMinusRegular,
  bold: FolderMinusBold,
  duotone: FolderMinusDuotone,
  fill: FolderMinusFill,
  light: FolderMinusLight,
  thin: FolderMinusThin,
} as const

export const FolderMinus = (props: IconProps) => {
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
