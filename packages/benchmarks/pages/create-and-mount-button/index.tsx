import Link from 'next/link'
import React from 'react'
export default function Home() {
  return (
    <div>
      <ul>
        <li>
          <Link href="create-and-mount-button/tamagui">Tamagui</Link>
        </li>
        <li>
          <Link href="create-and-mount-button/rnw">rnw</Link>
        </li>
        <li>
          <Link href="create-and-mount-button/rnw">Dripsy</Link>
        </li>
        <li>
          <Link href="create-and-mount-button/stitches-core-vc17">
            Stitches Core v1.0.0-canary.17
          </Link>
        </li>
        <li>
          <Link href="create-and-mount-button/stitches-react-vc17">
            Stitches React v1.0.0-canary.17
          </Link>
        </li>
        <li>
          <Link href="create-and-mount-button/styled-components">Styled Components</Link>
        </li>
        <li>
          <Link href="create-and-mount-button/emotion">Emotion</Link>
        </li>
        <li>
          <Link href="create-and-mount-button/baseline">Baseline</Link>
        </li>
      </ul>
    </div>
  )
}
