import { GenericFont } from './types'

export const createFont = <A extends GenericFont>(font: A): A => font
