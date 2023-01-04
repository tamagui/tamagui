import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileSearchBold } from '../bold/file-search-bold'
import { FileSearchDuotone } from '../duotone/file-search-duotone'
import { FileSearchFill } from '../fill/file-search-fill'
import { FileSearchLight } from '../light/file-search-light'
import { FileSearchRegular } from '../regular/file-search-regular'
import { FileSearchThin } from '../thin/file-search-thin'

const weightMap = {
  regular: FileSearchRegular,
  bold: FileSearchBold,
  duotone: FileSearchDuotone,
  fill: FileSearchFill,
  light: FileSearchLight,
  thin: FileSearchThin,
} as const

export const FileSearch = (props: IconProps) => {
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
