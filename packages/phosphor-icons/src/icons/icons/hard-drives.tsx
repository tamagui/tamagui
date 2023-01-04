import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HardDrivesBold } from '../bold/hard-drives-bold'
import { HardDrivesDuotone } from '../duotone/hard-drives-duotone'
import { HardDrivesFill } from '../fill/hard-drives-fill'
import { HardDrivesLight } from '../light/hard-drives-light'
import { HardDrivesRegular } from '../regular/hard-drives-regular'
import { HardDrivesThin } from '../thin/hard-drives-thin'

const weightMap = {
  regular: HardDrivesRegular,
  bold: HardDrivesBold,
  duotone: HardDrivesDuotone,
  fill: HardDrivesFill,
  light: HardDrivesLight,
  thin: HardDrivesThin,
} as const

export const HardDrives = (props: IconProps) => {
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
