import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { UploadSimpleBold } from '../bold/upload-simple-bold'
import { UploadSimpleDuotone } from '../duotone/upload-simple-duotone'
import { UploadSimpleFill } from '../fill/upload-simple-fill'
import { UploadSimpleLight } from '../light/upload-simple-light'
import { UploadSimpleRegular } from '../regular/upload-simple-regular'
import { UploadSimpleThin } from '../thin/upload-simple-thin'

const weightMap = {
  regular: UploadSimpleRegular,
  bold: UploadSimpleBold,
  duotone: UploadSimpleDuotone,
  fill: UploadSimpleFill,
  light: UploadSimpleLight,
  thin: UploadSimpleThin,
} as const

export const UploadSimple = (props: IconProps) => {
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
