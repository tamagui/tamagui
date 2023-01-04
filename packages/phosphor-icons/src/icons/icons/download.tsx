import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DownloadBold } from '../bold/download-bold'
import { DownloadDuotone } from '../duotone/download-duotone'
import { DownloadFill } from '../fill/download-fill'
import { DownloadLight } from '../light/download-light'
import { DownloadRegular } from '../regular/download-regular'
import { DownloadThin } from '../thin/download-thin'

const weightMap = {
  regular: DownloadRegular,
  bold: DownloadBold,
  duotone: DownloadDuotone,
  fill: DownloadFill,
  light: DownloadLight,
  thin: DownloadThin,
} as const

export const Download = (props: IconProps) => {
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
