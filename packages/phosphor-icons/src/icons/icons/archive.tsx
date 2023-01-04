import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArchiveBold } from '../bold/archive-bold'
import { ArchiveDuotone } from '../duotone/archive-duotone'
import { ArchiveFill } from '../fill/archive-fill'
import { ArchiveLight } from '../light/archive-light'
import { ArchiveRegular } from '../regular/archive-regular'
import { ArchiveThin } from '../thin/archive-thin'

const weightMap = {
  regular: ArchiveRegular,
  bold: ArchiveBold,
  duotone: ArchiveDuotone,
  fill: ArchiveFill,
  light: ArchiveLight,
  thin: ArchiveThin,
} as const

export const Archive = (props: IconProps) => {
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
