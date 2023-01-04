import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AddressBookBold } from '../bold/address-book-bold'
import { AddressBookDuotone } from '../duotone/address-book-duotone'
import { AddressBookFill } from '../fill/address-book-fill'
import { AddressBookLight } from '../light/address-book-light'
import { AddressBookRegular } from '../regular/address-book-regular'
import { AddressBookThin } from '../thin/address-book-thin'

const weightMap = {
  regular: AddressBookRegular,
  bold: AddressBookBold,
  duotone: AddressBookDuotone,
  fill: AddressBookFill,
  light: AddressBookLight,
  thin: AddressBookThin,
} as const

export const AddressBook = (props: IconProps) => {
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
