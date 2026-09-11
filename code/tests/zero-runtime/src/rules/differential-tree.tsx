import { View } from 'tamagui'
import { DifferentialCorpus } from './differential-tree.generated'
import { StaticTransition } from './transition-tree'

// one authored tree shared by the ordinary compiled and compiler-disabled
// routes. the transition slice stays first so the original regression controls
// remain part of every expanded observation.
export function DifferentialTree() {
  return (
    <View>
      <StaticTransition />
      <DifferentialCorpus />
    </View>
  )
}
