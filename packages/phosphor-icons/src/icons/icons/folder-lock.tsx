import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FolderLockBold } from '../bold/folder-lock-bold'
import { FolderLockDuotone } from '../duotone/folder-lock-duotone'
import { FolderLockFill } from '../fill/folder-lock-fill'
import { FolderLockLight } from '../light/folder-lock-light'
import { FolderLockRegular } from '../regular/folder-lock-regular'
import { FolderLockThin } from '../thin/folder-lock-thin'

const weightMap = {
  regular: FolderLockRegular,
  bold: FolderLockBold,
  duotone: FolderLockDuotone,
  fill: FolderLockFill,
  light: FolderLockLight,
  thin: FolderLockThin,
} as const

export const FolderLock = (props: IconProps) => {
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
