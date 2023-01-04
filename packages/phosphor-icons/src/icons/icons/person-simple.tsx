import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PersonSimpleBold } from '../bold/person-simple-bold'
import { PersonSimpleDuotone } from '../duotone/person-simple-duotone'
import { PersonSimpleFill } from '../fill/person-simple-fill'
import { PersonSimpleLight } from '../light/person-simple-light'
import { PersonSimpleRegular } from '../regular/person-simple-regular'
import { PersonSimpleThin } from '../thin/person-simple-thin'

const weightMap = {
  regular: PersonSimpleRegular,
  bold: PersonSimpleBold,
  duotone: PersonSimpleDuotone,
  fill: PersonSimpleFill,
  light: PersonSimpleLight,
  thin: PersonSimpleThin,
} as const

export const PersonSimple = (props: IconProps) => {
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
