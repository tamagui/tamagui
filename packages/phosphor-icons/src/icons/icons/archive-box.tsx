import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArchiveBoxBold } from '../bold/archive-box-bold'
import { ArchiveBoxDuotone } from '../duotone/archive-box-duotone'
import { ArchiveBoxFill } from '../fill/archive-box-fill'
import { ArchiveBoxLight } from '../light/archive-box-light'
import { ArchiveBoxRegular } from '../regular/archive-box-regular'
import { ArchiveBoxThin } from '../thin/archive-box-thin'

const weightMap = {
  regular: ArchiveBoxRegular,
  bold: ArchiveBoxBold,
  duotone: ArchiveBoxDuotone,
  fill: ArchiveBoxFill,
  light: ArchiveBoxLight,
  thin: ArchiveBoxThin,
} as const

export const ArchiveBox = (props: IconProps) => {
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
