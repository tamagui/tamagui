import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FilePptBold } from '../bold/file-ppt-bold'
import { FilePptDuotone } from '../duotone/file-ppt-duotone'
import { FilePptFill } from '../fill/file-ppt-fill'
import { FilePptLight } from '../light/file-ppt-light'
import { FilePptRegular } from '../regular/file-ppt-regular'
import { FilePptThin } from '../thin/file-ppt-thin'

const weightMap = {
  regular: FilePptRegular,
  bold: FilePptBold,
  duotone: FilePptDuotone,
  fill: FilePptFill,
  light: FilePptLight,
  thin: FilePptThin,
} as const

export const FilePpt = (props: IconProps) => {
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
