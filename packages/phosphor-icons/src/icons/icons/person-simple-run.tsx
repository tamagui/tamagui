import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PersonSimpleRunBold } from '../bold/person-simple-run-bold'
import { PersonSimpleRunDuotone } from '../duotone/person-simple-run-duotone'
import { PersonSimpleRunFill } from '../fill/person-simple-run-fill'
import { PersonSimpleRunLight } from '../light/person-simple-run-light'
import { PersonSimpleRunRegular } from '../regular/person-simple-run-regular'
import { PersonSimpleRunThin } from '../thin/person-simple-run-thin'

const weightMap = {
  regular: PersonSimpleRunRegular,
  bold: PersonSimpleRunBold,
  duotone: PersonSimpleRunDuotone,
  fill: PersonSimpleRunFill,
  light: PersonSimpleRunLight,
  thin: PersonSimpleRunThin,
} as const

export const PersonSimpleRun = (props: IconProps) => {
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
