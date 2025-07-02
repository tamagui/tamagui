import React from 'react'

import { ComponentContext } from '../contexts/ComponentContext'

export const useConfiguration = () => {
  return React.useContext(ComponentContext)
}
