import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { UploadBold } from '../bold/upload-bold'
import { UploadDuotone } from '../duotone/upload-duotone'
import { UploadFill } from '../fill/upload-fill'
import { UploadLight } from '../light/upload-light'
import { UploadRegular } from '../regular/upload-regular'
import { UploadThin } from '../thin/upload-thin'

const weightMap = {
  regular: UploadRegular,
  bold: UploadBold,
  duotone: UploadDuotone,
  fill: UploadFill,
  light: UploadLight,
  thin: UploadThin,
} as const

export const Upload = (props: IconProps) => {
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
