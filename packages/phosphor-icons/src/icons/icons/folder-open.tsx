import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FolderOpenBold } from '../bold/folder-open-bold'
import { FolderOpenDuotone } from '../duotone/folder-open-duotone'
import { FolderOpenFill } from '../fill/folder-open-fill'
import { FolderOpenLight } from '../light/folder-open-light'
import { FolderOpenRegular } from '../regular/folder-open-regular'
import { FolderOpenThin } from '../thin/folder-open-thin'

const weightMap = {
  regular: FolderOpenRegular,
  bold: FolderOpenBold,
  duotone: FolderOpenDuotone,
  fill: FolderOpenFill,
  light: FolderOpenLight,
  thin: FolderOpenThin,
} as const

export const FolderOpen = (props: IconProps) => {
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
