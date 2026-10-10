/* eslint-disable no-shadow-restricted-names */
import type { IconProps } from '@tamagui/helpers-icon'
import * as icons from './icons'

// a name -> component map of the generated set. it lives apart from the
// index so that importing a handful of icons never retains the whole set: a
// bundler that sees `Object.keys(ns)` on the index has to keep all of them.
// only reach this through a dynamic import().
export const allIcons: Record<string, (props: IconProps) => any> = icons
