import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FolderUserBold } from '../bold/folder-user-bold'
import { FolderUserDuotone } from '../duotone/folder-user-duotone'
import { FolderUserFill } from '../fill/folder-user-fill'
import { FolderUserLight } from '../light/folder-user-light'
import { FolderUserRegular } from '../regular/folder-user-regular'
import { FolderUserThin } from '../thin/folder-user-thin'

const weightMap = {
  regular: FolderUserRegular,
  bold: FolderUserBold,
  duotone: FolderUserDuotone,
  fill: FolderUserFill,
  light: FolderUserLight,
  thin: FolderUserThin,
} as const

export const FolderUser = (props: IconProps) => {
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
