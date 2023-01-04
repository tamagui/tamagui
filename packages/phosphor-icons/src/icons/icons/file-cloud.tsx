import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileCloudBold } from '../bold/file-cloud-bold'
import { FileCloudDuotone } from '../duotone/file-cloud-duotone'
import { FileCloudFill } from '../fill/file-cloud-fill'
import { FileCloudLight } from '../light/file-cloud-light'
import { FileCloudRegular } from '../regular/file-cloud-regular'
import { FileCloudThin } from '../thin/file-cloud-thin'

const weightMap = {
  regular: FileCloudRegular,
  bold: FileCloudBold,
  duotone: FileCloudDuotone,
  fill: FileCloudFill,
  light: FileCloudLight,
  thin: FileCloudThin,
} as const

export const FileCloud = (props: IconProps) => {
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
