import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FolderSimpleStarBold } from '../bold/folder-simple-star-bold'
import { FolderSimpleStarDuotone } from '../duotone/folder-simple-star-duotone'
import { FolderSimpleStarFill } from '../fill/folder-simple-star-fill'
import { FolderSimpleStarLight } from '../light/folder-simple-star-light'
import { FolderSimpleStarRegular } from '../regular/folder-simple-star-regular'
import { FolderSimpleStarThin } from '../thin/folder-simple-star-thin'

const weightMap = {
  regular: FolderSimpleStarRegular,
  bold: FolderSimpleStarBold,
  duotone: FolderSimpleStarDuotone,
  fill: FolderSimpleStarFill,
  light: FolderSimpleStarLight,
  thin: FolderSimpleStarThin,
} as const

export const FolderSimpleStar = (props: IconProps) => {
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
