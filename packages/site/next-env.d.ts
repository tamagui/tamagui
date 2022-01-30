/// <reference types="next" />
/// <reference types="next/image-types/global" />

import { Conf } from './tamagui.config'

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
