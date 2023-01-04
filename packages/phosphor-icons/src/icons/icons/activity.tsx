import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ActivityBold } from '../bold/activity-bold'
import { ActivityDuotone } from '../duotone/activity-duotone'
import { ActivityFill } from '../fill/activity-fill'
import { ActivityLight } from '../light/activity-light'
import { ActivityRegular } from '../regular/activity-regular'
import { ActivityThin } from '../thin/activity-thin'

const weightMap = {
  regular: ActivityRegular,
  bold: ActivityBold,
  duotone: ActivityDuotone,
  fill: ActivityFill,
  light: ActivityLight,
  thin: ActivityThin,
} as const

export const Activity = (props: IconProps) => {
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
