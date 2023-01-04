import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DesktopTowerBold } from '../bold/desktop-tower-bold'
import { DesktopTowerDuotone } from '../duotone/desktop-tower-duotone'
import { DesktopTowerFill } from '../fill/desktop-tower-fill'
import { DesktopTowerLight } from '../light/desktop-tower-light'
import { DesktopTowerRegular } from '../regular/desktop-tower-regular'
import { DesktopTowerThin } from '../thin/desktop-tower-thin'

const weightMap = {
  regular: DesktopTowerRegular,
  bold: DesktopTowerBold,
  duotone: DesktopTowerDuotone,
  fill: DesktopTowerFill,
  light: DesktopTowerLight,
  thin: DesktopTowerThin,
} as const

export const DesktopTower = (props: IconProps) => {
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
