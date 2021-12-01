import { Variable, createVariable } from './createVariable'

type GenericTheme = { [key: string]: string | Variable }

export const createTheme = <Theme extends GenericTheme>(theme: Theme): Theme => theme
