import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <ul>
        <li>
          <Link href="full-render-manual-test/stitches-react-vc17">
            Stitches React v1.0.0-canary.17
          </Link>
        </li>
        <li>
          <Link href="full-render-manual-test/stitches-react-alpha">Stitches React alpha</Link>
        </li>
        <li>
          <Link href="full-render-manual-test/styled-components">Styled components</Link>
        </li>
        <li>
          <Link href="full-render-manual-test/emotion">Emotion</Link>
        </li>
      </ul>
    </div>
  )
}
