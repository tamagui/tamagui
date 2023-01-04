import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArchiveTrayBold } from '../bold/archive-tray-bold'
import { ArchiveTrayDuotone } from '../duotone/archive-tray-duotone'
import { ArchiveTrayFill } from '../fill/archive-tray-fill'
import { ArchiveTrayLight } from '../light/archive-tray-light'
import { ArchiveTrayRegular } from '../regular/archive-tray-regular'
import { ArchiveTrayThin } from '../thin/archive-tray-thin'

const weightMap = {
  regular: ArchiveTrayRegular,
  bold: ArchiveTrayBold,
  duotone: ArchiveTrayDuotone,
  fill: ArchiveTrayFill,
  light: ArchiveTrayLight,
  thin: ArchiveTrayThin,
} as const

export const ArchiveTray = (props: IconProps) => {
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
