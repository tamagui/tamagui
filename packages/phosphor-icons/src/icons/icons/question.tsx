import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { QuestionBold } from '../bold/question-bold'
import { QuestionDuotone } from '../duotone/question-duotone'
import { QuestionFill } from '../fill/question-fill'
import { QuestionLight } from '../light/question-light'
import { QuestionRegular } from '../regular/question-regular'
import { QuestionThin } from '../thin/question-thin'

const weightMap = {
  regular: QuestionRegular,
  bold: QuestionBold,
  duotone: QuestionDuotone,
  fill: QuestionFill,
  light: QuestionLight,
  thin: QuestionThin,
} as const

export const Question = (props: IconProps) => {
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
