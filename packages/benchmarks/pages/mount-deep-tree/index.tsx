import Link from 'next/link'
import React from 'react'

export default function Home() {
  return (
    <div>
      <ul>
        <li>
          <Link href="mount-deep-tree/tamagui">Tamagui</Link>
        </li>
        <li>
          <Link href="mount-deep-tree/dripsy">Dripsy</Link>
        </li>
        <li>
          <Link href="mount-deep-tree/stitches-react-vc17">Stitches React v1.0.0-canary.17</Link>
        </li>
        <li>
          <Link href="mount-deep-tree/styled-components">Styled components</Link>
        </li>
        <li>
          <Link href="mount-deep-tree/emotion">Emotion</Link>
        </li>
      </ul>
    </div>
  )
}
