import Link from 'next/link'
export default function Home() {
  return (
    <div>
      <ul>
        <li>
          <Link href="change-css-prop/stitches-core-vc17">Stitches Core v1.0.0-canary.17</Link>
        </li>
        <li>
          <Link href="change-css-prop/stitches-react-vc17">Stitches React v1.0.0-canary.17</Link>
        </li>
        <li>
          <Link href="change-css-prop/styled-components">Styled Components</Link>
        </li>
        <li>
          <Link href="change-css-prop/emotion">Emotion</Link>
        </li>
        <li>
          <Link href="change-css-prop/baseline">Baseline</Link>
        </li>
      </ul>
    </div>
  )
}
