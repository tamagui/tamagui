import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FolderBold } from '../bold/folder-bold'
import { FolderDuotone } from '../duotone/folder-duotone'
import { FolderFill } from '../fill/folder-fill'
import { FolderLight } from '../light/folder-light'
import { FolderRegular } from '../regular/folder-regular'
import { FolderThin } from '../thin/folder-thin'

const weightMap = {
  regular: FolderRegular,
  bold: FolderBold,
  duotone: FolderDuotone,
  fill: FolderFill,
  light: FolderLight,
  thin: FolderThin,
} as const

export const Folder = (props: IconProps) => {
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
