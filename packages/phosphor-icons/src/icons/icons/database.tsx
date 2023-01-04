import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DatabaseBold } from '../bold/database-bold'
import { DatabaseDuotone } from '../duotone/database-duotone'
import { DatabaseFill } from '../fill/database-fill'
import { DatabaseLight } from '../light/database-light'
import { DatabaseRegular } from '../regular/database-regular'
import { DatabaseThin } from '../thin/database-thin'

const weightMap = {
  regular: DatabaseRegular,
  bold: DatabaseBold,
  duotone: DatabaseDuotone,
  fill: DatabaseFill,
  light: DatabaseLight,
  thin: DatabaseThin,
} as const

export const Database = (props: IconProps) => {
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
