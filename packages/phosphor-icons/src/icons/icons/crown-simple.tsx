import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CrownSimpleBold } from '../bold/crown-simple-bold'
import { CrownSimpleDuotone } from '../duotone/crown-simple-duotone'
import { CrownSimpleFill } from '../fill/crown-simple-fill'
import { CrownSimpleLight } from '../light/crown-simple-light'
import { CrownSimpleRegular } from '../regular/crown-simple-regular'
import { CrownSimpleThin } from '../thin/crown-simple-thin'

const weightMap = {
  regular: CrownSimpleRegular,
  bold: CrownSimpleBold,
  duotone: CrownSimpleDuotone,
  fill: CrownSimpleFill,
  light: CrownSimpleLight,
  thin: CrownSimpleThin,
} as const

export const CrownSimple = (props: IconProps) => {
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
