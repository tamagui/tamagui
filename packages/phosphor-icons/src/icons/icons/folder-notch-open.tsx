import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FolderNotchOpenBold } from '../bold/folder-notch-open-bold'
import { FolderNotchOpenDuotone } from '../duotone/folder-notch-open-duotone'
import { FolderNotchOpenFill } from '../fill/folder-notch-open-fill'
import { FolderNotchOpenLight } from '../light/folder-notch-open-light'
import { FolderNotchOpenRegular } from '../regular/folder-notch-open-regular'
import { FolderNotchOpenThin } from '../thin/folder-notch-open-thin'

const weightMap = {
  regular: FolderNotchOpenRegular,
  bold: FolderNotchOpenBold,
  duotone: FolderNotchOpenDuotone,
  fill: FolderNotchOpenFill,
  light: FolderNotchOpenLight,
  thin: FolderNotchOpenThin,
} as const

export const FolderNotchOpen = (props: IconProps) => {
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
