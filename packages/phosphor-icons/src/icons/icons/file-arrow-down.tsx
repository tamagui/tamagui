import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileArrowDownBold } from '../bold/file-arrow-down-bold'
import { FileArrowDownDuotone } from '../duotone/file-arrow-down-duotone'
import { FileArrowDownFill } from '../fill/file-arrow-down-fill'
import { FileArrowDownLight } from '../light/file-arrow-down-light'
import { FileArrowDownRegular } from '../regular/file-arrow-down-regular'
import { FileArrowDownThin } from '../thin/file-arrow-down-thin'

const weightMap = {
  regular: FileArrowDownRegular,
  bold: FileArrowDownBold,
  duotone: FileArrowDownDuotone,
  fill: FileArrowDownFill,
  light: FileArrowDownLight,
  thin: FileArrowDownThin,
} as const

export const FileArrowDown = (props: IconProps) => {
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
