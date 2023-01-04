import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FolderSimpleDottedBold } from '../bold/folder-simple-dotted-bold'
import { FolderSimpleDottedDuotone } from '../duotone/folder-simple-dotted-duotone'
import { FolderSimpleDottedFill } from '../fill/folder-simple-dotted-fill'
import { FolderSimpleDottedLight } from '../light/folder-simple-dotted-light'
import { FolderSimpleDottedRegular } from '../regular/folder-simple-dotted-regular'
import { FolderSimpleDottedThin } from '../thin/folder-simple-dotted-thin'

const weightMap = {
  regular: FolderSimpleDottedRegular,
  bold: FolderSimpleDottedBold,
  duotone: FolderSimpleDottedDuotone,
  fill: FolderSimpleDottedFill,
  light: FolderSimpleDottedLight,
  thin: FolderSimpleDottedThin,
} as const

export const FolderSimpleDotted = (props: IconProps) => {
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
