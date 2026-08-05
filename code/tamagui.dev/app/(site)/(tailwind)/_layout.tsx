import { Slot } from 'one'
import { DocsSyntaxLayout } from '~/features/docs/DocsSyntaxLayout'

export default function TailwindDocsLayout() {
  return (
    <DocsSyntaxLayout mode="tailwind">
      <Slot />
    </DocsSyntaxLayout>
  )
}
