import { createRoot } from 'react-dom/client'
import { html } from 'tamagui'

// A regular full-runtime web client built on the recommended DOM frontend.
//
// One tag is authored as JSX and lowers; the other is selected at runtime, so
// the compiler cannot replace it and the module defining `html.*` stays in the
// emitted graph. That is what gives the `@tamagui/dom` absence receipt
// something to find: the generated tables reach this runtime as types only, so
// shipping them would take a value import this build would then have to carry.
const wide = window.innerWidth > 600
const Runtime = wide ? html.section : html.article

export function DomClient() {
  return (
    <html.div id="dom-client">
      <Runtime>runtime html.*</Runtime>
    </html.div>
  )
}

createRoot(document.getElementById('root')!).render(<DomClient />)
