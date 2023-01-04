import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileCsvBold } from '../bold/file-csv-bold'
import { FileCsvDuotone } from '../duotone/file-csv-duotone'
import { FileCsvFill } from '../fill/file-csv-fill'
import { FileCsvLight } from '../light/file-csv-light'
import { FileCsvRegular } from '../regular/file-csv-regular'
import { FileCsvThin } from '../thin/file-csv-thin'

const weightMap = {
  regular: FileCsvRegular,
  bold: FileCsvBold,
  duotone: FileCsvDuotone,
  fill: FileCsvFill,
  light: FileCsvLight,
  thin: FileCsvThin,
} as const

export const FileCsv = (props: IconProps) => {
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
