import { View } from 'tamagui'
import { Alpha } from '../src/rules/multi/alpha'
import { Beta } from '../src/rules/multi/beta'
import { Delta } from '../src/rules/multi/delta'
import { Epsilon } from '../src/rules/multi/epsilon'
import { Gamma } from '../src/rules/multi/gamma'

/**
 * The multi-file aggregation control. Every violating site in every module of
 * this entry graph must be collected before the build fails, in one order.
 *
 * `getServerSideProps` keeps Next from prerendering it. In enforce mode the
 * build never gets that far, but report mode keeps the full runtime and exits
 * successfully, so Next would render this page at build time against no
 * provider, because the zero tier's `_app` has none to give. That failure would
 * be the fixture's, not report mode's, and it would read as report mode not
 * exiting successfully.
 */
export async function getServerSideProps() {
  return { props: {} }
}

export default function RuleMultiPage() {
  return (
    <View data-testid="zero-root">
      <Alpha />
      <Beta />
      <Gamma />
      <Delta />
      <Epsilon />
    </View>
  )
}
