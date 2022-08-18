// `version` is only exported in Vite 3
import * as vite from 'vite'

// @ts-ignore
export const isVite3 = vite.version?.startsWith('3.')
