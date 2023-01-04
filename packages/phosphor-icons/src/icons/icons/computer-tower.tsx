import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ComputerTowerBold } from '../bold/computer-tower-bold'
import { ComputerTowerDuotone } from '../duotone/computer-tower-duotone'
import { ComputerTowerFill } from '../fill/computer-tower-fill'
import { ComputerTowerLight } from '../light/computer-tower-light'
import { ComputerTowerRegular } from '../regular/computer-tower-regular'
import { ComputerTowerThin } from '../thin/computer-tower-thin'

const weightMap = {
  regular: ComputerTowerRegular,
  bold: ComputerTowerBold,
  duotone: ComputerTowerDuotone,
  fill: ComputerTowerFill,
  light: ComputerTowerLight,
  thin: ComputerTowerThin,
} as const

export const ComputerTower = (props: IconProps) => {
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
