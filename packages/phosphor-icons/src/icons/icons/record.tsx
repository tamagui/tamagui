import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RecordBold } from '../bold/record-bold'
import { RecordDuotone } from '../duotone/record-duotone'
import { RecordFill } from '../fill/record-fill'
import { RecordLight } from '../light/record-light'
import { RecordRegular } from '../regular/record-regular'
import { RecordThin } from '../thin/record-thin'

const weightMap = {
  regular: RecordRegular,
  bold: RecordBold,
  duotone: RecordDuotone,
  fill: RecordFill,
  light: RecordLight,
  thin: RecordThin,
} as const

export const Record = (props: IconProps) => {
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
