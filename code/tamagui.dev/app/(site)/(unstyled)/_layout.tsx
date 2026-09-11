import { Slot } from 'one'
import { DocsSyntaxLayout } from '~/features/docs/DocsSyntaxLayout'

export default function UnstyledDocsLayout() {
  return (
    <DocsSyntaxLayout>
      <Slot />
    </DocsSyntaxLayout>
  )
}
