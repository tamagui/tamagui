import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FolderNotchBold } from '../bold/folder-notch-bold'
import { FolderNotchDuotone } from '../duotone/folder-notch-duotone'
import { FolderNotchFill } from '../fill/folder-notch-fill'
import { FolderNotchLight } from '../light/folder-notch-light'
import { FolderNotchRegular } from '../regular/folder-notch-regular'
import { FolderNotchThin } from '../thin/folder-notch-thin'

const weightMap = {
  regular: FolderNotchRegular,
  bold: FolderNotchBold,
  duotone: FolderNotchDuotone,
  fill: FolderNotchFill,
  light: FolderNotchLight,
  thin: FolderNotchThin,
} as const

export const FolderNotch = (props: IconProps) => {
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
