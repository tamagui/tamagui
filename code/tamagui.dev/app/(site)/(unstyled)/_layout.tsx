import { Slot } from 'one'
import { DocsSyntaxLayout } from '~/features/docs/DocsSyntaxLayout'

export default function UnstyledDocsLayout() {
  return (
    <DocsSyntaxLayout mode="unstyled">
      <Slot />
    </DocsSyntaxLayout>
  )
}
