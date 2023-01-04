import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CoatHangerBold } from '../bold/coat-hanger-bold'
import { CoatHangerDuotone } from '../duotone/coat-hanger-duotone'
import { CoatHangerFill } from '../fill/coat-hanger-fill'
import { CoatHangerLight } from '../light/coat-hanger-light'
import { CoatHangerRegular } from '../regular/coat-hanger-regular'
import { CoatHangerThin } from '../thin/coat-hanger-thin'

const weightMap = {
  regular: CoatHangerRegular,
  bold: CoatHangerBold,
  duotone: CoatHangerDuotone,
  fill: CoatHangerFill,
  light: CoatHangerLight,
  thin: CoatHangerThin,
} as const

export const CoatHanger = (props: IconProps) => {
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
