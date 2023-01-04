import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FilmScriptBold } from '../bold/film-script-bold'
import { FilmScriptDuotone } from '../duotone/film-script-duotone'
import { FilmScriptFill } from '../fill/film-script-fill'
import { FilmScriptLight } from '../light/film-script-light'
import { FilmScriptRegular } from '../regular/film-script-regular'
import { FilmScriptThin } from '../thin/film-script-thin'

const weightMap = {
  regular: FilmScriptRegular,
  bold: FilmScriptBold,
  duotone: FilmScriptDuotone,
  fill: FilmScriptFill,
  light: FilmScriptLight,
  thin: FilmScriptThin,
} as const

export const FilmScript = (props: IconProps) => {
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
