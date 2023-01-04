import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ExamBold } from '../bold/exam-bold'
import { ExamDuotone } from '../duotone/exam-duotone'
import { ExamFill } from '../fill/exam-fill'
import { ExamLight } from '../light/exam-light'
import { ExamRegular } from '../regular/exam-regular'
import { ExamThin } from '../thin/exam-thin'

const weightMap = {
  regular: ExamRegular,
  bold: ExamBold,
  duotone: ExamDuotone,
  fill: ExamFill,
  light: ExamLight,
  thin: ExamThin,
} as const

export const Exam = (props: IconProps) => {
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
