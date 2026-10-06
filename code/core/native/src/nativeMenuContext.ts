import type React from 'react'
import { createContext } from 'react'

// one context per runtime: core reads it and the menu packages provide it, so a
// second copy of this module (a bundled core, a duplicated install) must not
// split them into two contexts that never see each other
const KEY = '__tamagui_native_menu_context__'
const g = globalThis as typeof globalThis & { [KEY]?: React.Context<boolean> }

export const NativeMenuContext: React.Context<boolean> = (g[KEY] ??= createContext(false))
