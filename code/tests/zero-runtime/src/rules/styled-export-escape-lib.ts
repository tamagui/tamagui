import { ExportedCard } from './styled-export-lib'

// A `.ts` module is not JSX-authored, so the zero transform never runs on it.
// It reads the exported styled definition as a value, which erasure in the
// neighbouring module would turn into a ReferenceError. The build-wide gate is
// what must catch that, because no single module can see it.
export const cardName = (ExportedCard as any)?.displayName ?? 'unknown'
