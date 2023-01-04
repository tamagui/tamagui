import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileJpgBold } from '../bold/file-jpg-bold'
import { FileJpgDuotone } from '../duotone/file-jpg-duotone'
import { FileJpgFill } from '../fill/file-jpg-fill'
import { FileJpgLight } from '../light/file-jpg-light'
import { FileJpgRegular } from '../regular/file-jpg-regular'
import { FileJpgThin } from '../thin/file-jpg-thin'

const weightMap = {
  regular: FileJpgRegular,
  bold: FileJpgBold,
  duotone: FileJpgDuotone,
  fill: FileJpgFill,
  light: FileJpgLight,
  thin: FileJpgThin,
} as const

export const FileJpg = (props: IconProps) => {
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
