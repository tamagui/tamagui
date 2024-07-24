'use client'

import { useGlobalState } from '../state/useGlobalState'
import { ColorCanvas } from './ColorCanvas'
import { ColorHeaderActions } from './ColorHeaderActions'
import { ColorsSidebarLeft } from './ColorsSidebarLeft'
import { ColorsSidebarRight } from './ColorsSidebarRight'

export default function Page() {
  const state = useGlobalState()

  if (!state.colors.scheme) {
    return null
  }

  return (
    <>
      <ColorHeaderActions />
      <ColorsSidebarLeft />
      <ColorCanvas />
      <ColorsSidebarRight />
    </>
  )
}
