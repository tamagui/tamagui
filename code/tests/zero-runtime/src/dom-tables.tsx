import { TAG_NAMES } from '@tamagui/dom'
import { createRoot } from 'react-dom/client'
import { html } from 'tamagui'

// The positive control for the `@tamagui/dom` absence receipt: the same client,
// plus one value import of the generated tables. If the matcher cannot find the
// package here, its absence from `dom-client` proves nothing.
const wide = window.innerWidth > 600
const Runtime = wide ? html.section : html.article

export function DomTables() {
  return (
    <html.div id="dom-tables">
      <Runtime>{`${TAG_NAMES.length} tags`}</Runtime>
    </html.div>
  )
}

createRoot(document.getElementById('root')!).render(<DomTables />)
