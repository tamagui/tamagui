import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FolderSimplePlusBold } from '../bold/folder-simple-plus-bold'
import { FolderSimplePlusDuotone } from '../duotone/folder-simple-plus-duotone'
import { FolderSimplePlusFill } from '../fill/folder-simple-plus-fill'
import { FolderSimplePlusLight } from '../light/folder-simple-plus-light'
import { FolderSimplePlusRegular } from '../regular/folder-simple-plus-regular'
import { FolderSimplePlusThin } from '../thin/folder-simple-plus-thin'

const weightMap = {
  regular: FolderSimplePlusRegular,
  bold: FolderSimplePlusBold,
  duotone: FolderSimplePlusDuotone,
  fill: FolderSimplePlusFill,
  light: FolderSimplePlusLight,
  thin: FolderSimplePlusThin,
} as const

export const FolderSimplePlus = (props: IconProps) => {
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
