import { missingToken } from '#missing'
import { View as Frame } from '@fixture/ui'
import { jsx } from 'react/jsx-runtime'

declare const getValue: () => number

export const linkedValue = missingToken
export const dynamicValue = getValue()
export const localSyntax = jsx(Frame, { [getValue()]: 1 })
