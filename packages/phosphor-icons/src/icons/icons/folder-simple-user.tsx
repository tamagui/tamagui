import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FolderSimpleUserBold } from '../bold/folder-simple-user-bold'
import { FolderSimpleUserDuotone } from '../duotone/folder-simple-user-duotone'
import { FolderSimpleUserFill } from '../fill/folder-simple-user-fill'
import { FolderSimpleUserLight } from '../light/folder-simple-user-light'
import { FolderSimpleUserRegular } from '../regular/folder-simple-user-regular'
import { FolderSimpleUserThin } from '../thin/folder-simple-user-thin'

const weightMap = {
  regular: FolderSimpleUserRegular,
  bold: FolderSimpleUserBold,
  duotone: FolderSimpleUserDuotone,
  fill: FolderSimpleUserFill,
  light: FolderSimpleUserLight,
  thin: FolderSimpleUserThin,
} as const

export const FolderSimpleUser = (props: IconProps) => {
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
