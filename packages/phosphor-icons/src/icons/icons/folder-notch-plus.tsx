import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FolderNotchPlusBold } from '../bold/folder-notch-plus-bold'
import { FolderNotchPlusDuotone } from '../duotone/folder-notch-plus-duotone'
import { FolderNotchPlusFill } from '../fill/folder-notch-plus-fill'
import { FolderNotchPlusLight } from '../light/folder-notch-plus-light'
import { FolderNotchPlusRegular } from '../regular/folder-notch-plus-regular'
import { FolderNotchPlusThin } from '../thin/folder-notch-plus-thin'

const weightMap = {
  regular: FolderNotchPlusRegular,
  bold: FolderNotchPlusBold,
  duotone: FolderNotchPlusDuotone,
  fill: FolderNotchPlusFill,
  light: FolderNotchPlusLight,
  thin: FolderNotchPlusThin,
} as const

export const FolderNotchPlus = (props: IconProps) => {
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
