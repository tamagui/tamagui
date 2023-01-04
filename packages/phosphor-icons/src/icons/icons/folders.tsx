import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FoldersBold } from '../bold/folders-bold'
import { FoldersDuotone } from '../duotone/folders-duotone'
import { FoldersFill } from '../fill/folders-fill'
import { FoldersLight } from '../light/folders-light'
import { FoldersRegular } from '../regular/folders-regular'
import { FoldersThin } from '../thin/folders-thin'

const weightMap = {
  regular: FoldersRegular,
  bold: FoldersBold,
  duotone: FoldersDuotone,
  fill: FoldersFill,
  light: FoldersLight,
  thin: FoldersThin,
} as const

export const Folders = (props: IconProps) => {
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
