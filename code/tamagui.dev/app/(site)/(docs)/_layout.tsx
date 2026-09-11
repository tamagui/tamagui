import { Slot } from 'one'
import { DocsSyntaxLayout } from '~/features/docs/DocsSyntaxLayout'

export default function DocsLayout() {
  return (
    <DocsSyntaxLayout>
      <Slot />
    </DocsSyntaxLayout>
  )
}
