import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FolderDottedBold } from '../bold/folder-dotted-bold'
import { FolderDottedDuotone } from '../duotone/folder-dotted-duotone'
import { FolderDottedFill } from '../fill/folder-dotted-fill'
import { FolderDottedLight } from '../light/folder-dotted-light'
import { FolderDottedRegular } from '../regular/folder-dotted-regular'
import { FolderDottedThin } from '../thin/folder-dotted-thin'

const weightMap = {
  regular: FolderDottedRegular,
  bold: FolderDottedBold,
  duotone: FolderDottedDuotone,
  fill: FolderDottedFill,
  light: FolderDottedLight,
  thin: FolderDottedThin,
} as const

export const FolderDotted = (props: IconProps) => {
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
