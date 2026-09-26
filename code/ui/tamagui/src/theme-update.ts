import type { RefComponent } from '@tamagui/compose-refs'
import type { ReservedThemePropName, VariableValIn } from '@tamagui/core'
import { ThemeUpdate as ThemeUpdateImplementation } from '@tamagui/core/theme-update'
import type { ReactNode } from 'react'
import type { ThemeKeys } from '.'

type ThemeUpdateValues = string extends ThemeKeys
  ? {}
  : {
      [Key in Exclude<ThemeKeys, ReservedThemePropName>]?: VariableValIn
    }

export type ThemeUpdateProps = ThemeUpdateValues & { children?: ReactNode }

export const ThemeUpdate: RefComponent<unknown, ThemeUpdateProps> =
  ThemeUpdateImplementation
