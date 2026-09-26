import { FixtureFrame, compilerResolution } from '@fixture/components'
import { LocalFrame } from './LocalFrame'

export function App() {
  return (
    <FixtureFrame padding="sm:9px" data-resolution={compilerResolution}>
      <LocalFrame />
    </FixtureFrame>
  )
}
