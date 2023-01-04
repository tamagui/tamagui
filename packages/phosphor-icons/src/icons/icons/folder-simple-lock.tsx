import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FolderSimpleLockBold } from '../bold/folder-simple-lock-bold'
import { FolderSimpleLockDuotone } from '../duotone/folder-simple-lock-duotone'
import { FolderSimpleLockFill } from '../fill/folder-simple-lock-fill'
import { FolderSimpleLockLight } from '../light/folder-simple-lock-light'
import { FolderSimpleLockRegular } from '../regular/folder-simple-lock-regular'
import { FolderSimpleLockThin } from '../thin/folder-simple-lock-thin'

const weightMap = {
  regular: FolderSimpleLockRegular,
  bold: FolderSimpleLockBold,
  duotone: FolderSimpleLockDuotone,
  fill: FolderSimpleLockFill,
  light: FolderSimpleLockLight,
  thin: FolderSimpleLockThin,
} as const

export const FolderSimpleLock = (props: IconProps) => {
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
