import * as React from 'react'

import { HeaderFloating } from './HeaderFloating'
import { HeaderProps } from './HeaderProps'

export const HeaderIndependent = ({
  alwaysFloating = true,
  ...props
}: Omit<HeaderProps, 'floating'> & {
  alwaysFloating?: boolean
}) => {
  return (
    <>
      <HeaderFloating alwaysFloating={alwaysFloating} {...props} />
    </>
  )
}
