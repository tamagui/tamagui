import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DownloadSimpleBold } from '../bold/download-simple-bold'
import { DownloadSimpleDuotone } from '../duotone/download-simple-duotone'
import { DownloadSimpleFill } from '../fill/download-simple-fill'
import { DownloadSimpleLight } from '../light/download-simple-light'
import { DownloadSimpleRegular } from '../regular/download-simple-regular'
import { DownloadSimpleThin } from '../thin/download-simple-thin'

const weightMap = {
  regular: DownloadSimpleRegular,
  bold: DownloadSimpleBold,
  duotone: DownloadSimpleDuotone,
  fill: DownloadSimpleFill,
  light: DownloadSimpleLight,
  thin: DownloadSimpleThin,
} as const

export const DownloadSimple = (props: IconProps) => {
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
