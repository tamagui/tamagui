import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PersonBold } from '../bold/person-bold'
import { PersonDuotone } from '../duotone/person-duotone'
import { PersonFill } from '../fill/person-fill'
import { PersonLight } from '../light/person-light'
import { PersonRegular } from '../regular/person-regular'
import { PersonThin } from '../thin/person-thin'

const weightMap = {
  regular: PersonRegular,
  bold: PersonBold,
  duotone: PersonDuotone,
  fill: PersonFill,
  light: PersonLight,
  thin: PersonThin,
} as const

export const Person = (props: IconProps) => {
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
