import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ProjectorScreenBold } from '../bold/projector-screen-bold'
import { ProjectorScreenDuotone } from '../duotone/projector-screen-duotone'
import { ProjectorScreenFill } from '../fill/projector-screen-fill'
import { ProjectorScreenLight } from '../light/projector-screen-light'
import { ProjectorScreenRegular } from '../regular/projector-screen-regular'
import { ProjectorScreenThin } from '../thin/projector-screen-thin'

const weightMap = {
  regular: ProjectorScreenRegular,
  bold: ProjectorScreenBold,
  duotone: ProjectorScreenDuotone,
  fill: ProjectorScreenFill,
  light: ProjectorScreenLight,
  thin: ProjectorScreenThin,
} as const

export const ProjectorScreen = (props: IconProps) => {
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
