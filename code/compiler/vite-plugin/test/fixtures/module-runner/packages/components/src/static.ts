import { FixtureFrame } from './FixtureFrame'
import { compilerResolution } from './resolution'

globalThis.__tamaguiFixtureEvaluationOrder ??= []
globalThis.__tamaguiFixtureEvaluationOrder.push('component')

export default { FixtureFrame, compilerResolution }
