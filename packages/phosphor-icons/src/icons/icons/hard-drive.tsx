import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HardDriveBold } from '../bold/hard-drive-bold'
import { HardDriveDuotone } from '../duotone/hard-drive-duotone'
import { HardDriveFill } from '../fill/hard-drive-fill'
import { HardDriveLight } from '../light/hard-drive-light'
import { HardDriveRegular } from '../regular/hard-drive-regular'
import { HardDriveThin } from '../thin/hard-drive-thin'

const weightMap = {
  regular: HardDriveRegular,
  bold: HardDriveBold,
  duotone: HardDriveDuotone,
  fill: HardDriveFill,
  light: HardDriveLight,
  thin: HardDriveThin,
} as const

export const HardDrive = (props: IconProps) => {
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
