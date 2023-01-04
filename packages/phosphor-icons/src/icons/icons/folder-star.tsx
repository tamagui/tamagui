import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FolderStarBold } from '../bold/folder-star-bold'
import { FolderStarDuotone } from '../duotone/folder-star-duotone'
import { FolderStarFill } from '../fill/folder-star-fill'
import { FolderStarLight } from '../light/folder-star-light'
import { FolderStarRegular } from '../regular/folder-star-regular'
import { FolderStarThin } from '../thin/folder-star-thin'

const weightMap = {
  regular: FolderStarRegular,
  bold: FolderStarBold,
  duotone: FolderStarDuotone,
  fill: FolderStarFill,
  light: FolderStarLight,
  thin: FolderStarThin,
} as const

export const FolderStar = (props: IconProps) => {
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
