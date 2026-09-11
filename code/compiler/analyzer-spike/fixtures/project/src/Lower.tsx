// π🙂 must remain exact across edited, untouched, and appended-import mappings.
import { View as Frame } from '@fixture/ui'

declare const getProps: () => Record<string, unknown>

export const Lower = () => (
  <>
    <Frame padding={12} data-sentinel="untouched" />
    <Frame {...getProps()} data-bailout="byte-identical" />
  </>
)
