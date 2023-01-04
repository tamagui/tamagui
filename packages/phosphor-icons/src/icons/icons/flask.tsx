import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FlaskBold } from '../bold/flask-bold'
import { FlaskDuotone } from '../duotone/flask-duotone'
import { FlaskFill } from '../fill/flask-fill'
import { FlaskLight } from '../light/flask-light'
import { FlaskRegular } from '../regular/flask-regular'
import { FlaskThin } from '../thin/flask-thin'

const weightMap = {
  regular: FlaskRegular,
  bold: FlaskBold,
  duotone: FlaskDuotone,
  fill: FlaskFill,
  light: FlaskLight,
  thin: FlaskThin,
} as const

export const Flask = (props: IconProps) => {
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
