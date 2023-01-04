import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FolderSimpleMinusBold } from '../bold/folder-simple-minus-bold'
import { FolderSimpleMinusDuotone } from '../duotone/folder-simple-minus-duotone'
import { FolderSimpleMinusFill } from '../fill/folder-simple-minus-fill'
import { FolderSimpleMinusLight } from '../light/folder-simple-minus-light'
import { FolderSimpleMinusRegular } from '../regular/folder-simple-minus-regular'
import { FolderSimpleMinusThin } from '../thin/folder-simple-minus-thin'

const weightMap = {
  regular: FolderSimpleMinusRegular,
  bold: FolderSimpleMinusBold,
  duotone: FolderSimpleMinusDuotone,
  fill: FolderSimpleMinusFill,
  light: FolderSimpleMinusLight,
  thin: FolderSimpleMinusThin,
} as const

export const FolderSimpleMinus = (props: IconProps) => {
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
