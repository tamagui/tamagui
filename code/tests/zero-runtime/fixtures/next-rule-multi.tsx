import { View } from 'tamagui'
import { Alpha } from '../src/rules/multi/alpha'
import { Beta } from '../src/rules/multi/beta'

/**
 * The multi-file aggregation control. Every violating site in every module of
 * this entry graph must be collected before the build fails, in one order.
 */
export default function RuleMultiPage() {
  return (
    <View data-testid="zero-root">
      <Alpha />
      <Beta />
    </View>
  )
}
