import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MicrosoftExcelLogoBold } from '../bold/microsoft-excel-logo-bold'
import { MicrosoftExcelLogoDuotone } from '../duotone/microsoft-excel-logo-duotone'
import { MicrosoftExcelLogoFill } from '../fill/microsoft-excel-logo-fill'
import { MicrosoftExcelLogoLight } from '../light/microsoft-excel-logo-light'
import { MicrosoftExcelLogoRegular } from '../regular/microsoft-excel-logo-regular'
import { MicrosoftExcelLogoThin } from '../thin/microsoft-excel-logo-thin'

const weightMap = {
  regular: MicrosoftExcelLogoRegular,
  bold: MicrosoftExcelLogoBold,
  duotone: MicrosoftExcelLogoDuotone,
  fill: MicrosoftExcelLogoFill,
  light: MicrosoftExcelLogoLight,
  thin: MicrosoftExcelLogoThin,
} as const

export const MicrosoftExcelLogo = (props: IconProps) => {
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
