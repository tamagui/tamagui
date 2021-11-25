import Link from 'next/link'
export default function Home() {
  return (
    <div>
      <ul>
        <li>
          <Link href="change-a-variant/tamagui">Tamagui</Link>
        </li>
        <li>
          <Link href="change-a-variant/dripsy">dripsy</Link>
        </li>
        <li>
          <Link href="change-a-variant/nativebase">nativebase</Link>
        </li>
        <li>
          <Link href="change-a-variant/rnw">rnw</Link>
        </li>
        <li>
          <Link href="change-a-variant/stitches-core-vc17">Stitches Core v1.0.0-canary.17</Link>
        </li>
        <li>
          <Link href="change-a-variant/stitches-react-vc17">Stitches React v1.0.0-canary.17</Link>
        </li>
        <li>
          <Link href="change-a-variant/styled-components">Styled Components</Link>
        </li>
        <li>
          <Link href="change-a-variant/emotion">Emotion</Link>
        </li>
      </ul>
    </div>
  )
}
