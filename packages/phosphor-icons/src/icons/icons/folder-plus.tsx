import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FolderPlusBold } from '../bold/folder-plus-bold'
import { FolderPlusDuotone } from '../duotone/folder-plus-duotone'
import { FolderPlusFill } from '../fill/folder-plus-fill'
import { FolderPlusLight } from '../light/folder-plus-light'
import { FolderPlusRegular } from '../regular/folder-plus-regular'
import { FolderPlusThin } from '../thin/folder-plus-thin'

const weightMap = {
  regular: FolderPlusRegular,
  bold: FolderPlusBold,
  duotone: FolderPlusDuotone,
  fill: FolderPlusFill,
  light: FolderPlusLight,
  thin: FolderPlusThin,
} as const

export const FolderPlus = (props: IconProps) => {
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
