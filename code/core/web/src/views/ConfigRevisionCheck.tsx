import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import React from 'react'
import {
  getConfigRevisionSnapshot,
  type ConfigRevisionParts,
} from '../helpers/grammarConfig'
import type { TamaguiInternalConfig } from '../types'

const partNames = [
  'media',
  'themeNames',
  'themeVariables',
  'tokens',
  'fonts',
  'shorthands',
] as const

export function ConfigRevisionCheck({ config }: { config: TamaguiInternalConfig }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const checked = React.useRef(false)
  const client = getConfigRevisionSnapshot(config)
  const clientParts = JSON.stringify(client.parts)

  useIsomorphicLayoutEffect(() => {
    if (checked.current) return
    checked.current = true

    const marker = ref.current
    const serverRevision = marker?.getAttribute('data-tamagui-config-revision')
    const serverPartsJSON = marker?.getAttribute('data-tamagui-config-revision-parts')
    if (!serverRevision || !serverPartsJSON || serverRevision === client.revision) return

    let serverParts: Partial<ConfigRevisionParts> = {}
    try {
      serverParts = JSON.parse(serverPartsJSON)
    } catch {}

    const differingParts = partNames.filter(
      (part) => serverParts[part] !== client.parts[part]
    )
    console.error(
      `[tamagui] Server/client config revision mismatch during hydration: server "${serverRevision}", client "${client.revision}". Differing parts: ${differingParts.join(', ') || 'unknown'}. Every input to the config revision must have identical names and queries in both environments; values may be omitted from an optimized client config, but their theme, variable, token, font, media, and shorthand names must remain.`
    )
  }, [client.revision, clientParts])

  return (
    <span
      ref={ref}
      aria-hidden
      hidden
      data-tamagui-config-revision={client.revision}
      data-tamagui-config-revision-parts={clientParts}
    />
  )
}
