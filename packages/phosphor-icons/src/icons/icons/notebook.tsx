import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NotebookBold } from '../bold/notebook-bold'
import { NotebookDuotone } from '../duotone/notebook-duotone'
import { NotebookFill } from '../fill/notebook-fill'
import { NotebookLight } from '../light/notebook-light'
import { NotebookRegular } from '../regular/notebook-regular'
import { NotebookThin } from '../thin/notebook-thin'

const weightMap = {
  regular: NotebookRegular,
  bold: NotebookBold,
  duotone: NotebookDuotone,
  fill: NotebookFill,
  light: NotebookLight,
  thin: NotebookThin,
} as const

export const Notebook = (props: IconProps) => {
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
