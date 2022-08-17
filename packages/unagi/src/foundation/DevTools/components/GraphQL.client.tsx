import React, { useEffect, useState } from 'react'

import type { DevServerMessage } from '../../../utilities/devtools.js'

export function GraphQL() {
  const [warnings, setWarnings] = useState<string[] | null>(null)

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.on('unagi-dev-tools', ({ type, data }: DevServerMessage) => {
        if (type === 'warn') {
          setWarnings((state) => [...(state || []), data])
        }
      })
    }
  }, [])

  const warningsMarkup = warnings
    ? warnings.map((war, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <li key={war + i}>
          <pre>{war}</pre>
        </li>
      ))
    : null
  return (
    <div>
      <ul
        style={{
          fontFamily: 'monospace',
          paddingTop: '1em',
          fontSize: '0.9em',
        }}
      >
        {warningsMarkup}
      </ul>
    </div>
  )
}
