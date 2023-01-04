import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RocketLaunchBold } from '../bold/rocket-launch-bold'
import { RocketLaunchDuotone } from '../duotone/rocket-launch-duotone'
import { RocketLaunchFill } from '../fill/rocket-launch-fill'
import { RocketLaunchLight } from '../light/rocket-launch-light'
import { RocketLaunchRegular } from '../regular/rocket-launch-regular'
import { RocketLaunchThin } from '../thin/rocket-launch-thin'

const weightMap = {
  regular: RocketLaunchRegular,
  bold: RocketLaunchBold,
  duotone: RocketLaunchDuotone,
  fill: RocketLaunchFill,
  light: RocketLaunchLight,
  thin: RocketLaunchThin,
} as const

export const RocketLaunch = (props: IconProps) => {
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
