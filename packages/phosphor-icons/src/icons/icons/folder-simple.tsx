import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FolderSimpleBold } from '../bold/folder-simple-bold'
import { FolderSimpleDuotone } from '../duotone/folder-simple-duotone'
import { FolderSimpleFill } from '../fill/folder-simple-fill'
import { FolderSimpleLight } from '../light/folder-simple-light'
import { FolderSimpleRegular } from '../regular/folder-simple-regular'
import { FolderSimpleThin } from '../thin/folder-simple-thin'

const weightMap = {
  regular: FolderSimpleRegular,
  bold: FolderSimpleBold,
  duotone: FolderSimpleDuotone,
  fill: FolderSimpleFill,
  light: FolderSimpleLight,
  thin: FolderSimpleThin,
} as const

export const FolderSimple = (props: IconProps) => {
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
