import { FixtureFrame, compilerResolution } from '@fixture/components'
import { LocalFrame } from './LocalFrame'

export function App() {
  return (
    <FixtureFrame $sm={{ padding: 9 }} data-resolution={compilerResolution}>
      <LocalFrame />
    </FixtureFrame>
  )
}
