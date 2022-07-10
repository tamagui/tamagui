import '@tamagui/polyfill-dev'

import type { Portal } from '@gorhom/portal'

// own package in case need to patch or change
export * from '@gorhom/portal'

type PortalType = typeof Portal
export type PortalProps = PortalType extends (props: infer Props) => void ? Props : never
